// deno-lint-ignore-file no-explicit-any
import { Env } from "@Core/common/env.ts";
import { Database } from "@Database";
import * as bcrypt from "bcrypt";
import { ObjectId, ClientSession } from "mongo";
import { WalletModel } from "@Models/wallet.ts";
import { TransactionModel, TransactionStatus } from "@Models/transaction.ts";
import { Store } from "@Core/common/store.ts";

export class Wallet {
  static getDefaultType() {
    return Env.get("DEFAULT_WALLET_TYPE");
  }

  static async getTypes() {
    return (
      (await Env.get("SUPPORTED_WALLET_TYPES", true))?.split(/\s*,\s*/) ?? []
    );
  }

  static async isValidType(type: string) {
    return (await this.getTypes()).includes(type);
  }

  static getDefaultCurrency() {
    return Env.get("DEFAULT_WALLET_CURRENCY");
  }

  static async getCurrencies() {
    return (
      (await Env.get("SUPPORTED_WALLET_CURRENCIES", true))?.split(/\s*,\s*/) ??
      []
    );
  }

  static async isValidCurrency(currency: string) {
    return (await this.getCurrencies()).includes(currency);
  }

  static async createBalanceDigest(
    account: ObjectId | string,
    type: string,
    currency: string,
    balance: number
  ) {
    return bcrypt.hash(
      `${await Env.get(
        "ENCRYPTION_KEY"
      )}:${account}:${type}:${currency}:${balance}`
    );
  }

  static async compareBalanceDigest(
    account: ObjectId | string,
    type: string,
    currency: string,
    balance: number,
    digest: string
  ) {
    return bcrypt.compare(
      `${await Env.get(
        "ENCRYPTION_KEY"
      )}:${account}:${type}:${currency}:${balance}`,
      digest
    );
  }

  static async hasOverdraftMargin(
    account: ObjectId | string,
    type: string,
    currency: string,
    postTransactionBalance: number,
    options?: {
      skipAccountCheck?: boolean;
    }
  ) {
    if (!options?.skipAccountCheck) {
      const Accounts =
        (await Env.get("WALLET_OVERDRAFT_ENABLED_ACCOUNTS", true))?.split(
          /\s*,\s*/
        ) ?? [];

      if (!Accounts.includes(account.toString())) return false;
    }

    const RawLimit = await Env.get(
      `WALLET_OVERDRAFT_LIMIT_${type.toUpperCase()}_${currency.toUpperCase()}`,
      true
    );

    const Limit = !isNaN(RawLimit as unknown as number)
      ? parseFloat(RawLimit!)
      : 0;

    return postTransactionBalance >= Limit;
  }

  static async create(
    account: ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      databaseSession?: ClientSession;
    }
  ) {
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    if (!(await this.isValidType(Type)))
      throw new Error(`Invalid wallet type '${Type}'!`);

    if (!(await this.isValidCurrency(Currency)))
      throw new Error(`Invalid currency '${Currency}'!`);

    const Balance = 0;

    return WalletModel.create(
      {
        account: new ObjectId(account),
        type: Type,
        currency: Currency,
        balance: Balance,
        digest: await this.createBalanceDigest(
          account,
          Type,
          Currency,
          Balance
        ),
      },
      { session: options?.databaseSession }
    );
  }

  static async get(
    account: ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      databaseSession?: ClientSession;
    }
  ) {
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    let Wallet = await WalletModel.findOne(
      {
        account: new ObjectId(account),
        type: Type,
        currency: Currency,
      },
      { session: options?.databaseSession }
    ).project({ transactions: 0 });

    if (!Wallet) Wallet = await this.create(account, options);
    else if (
      !(await this.compareBalanceDigest(
        Wallet.account,
        Wallet.type,
        Wallet.currency,
        Wallet.balance,
        Wallet.digest
      ))
    )
      throw new Error(`Balance tampering detected!`);

    return Wallet;
  }

  static async list(
    account: ObjectId | string,
    options: {
      types: string[];
      currencies: string[];
      databaseSession?: ClientSession;
    }
  ) {
    return await Promise.all(
      (
        await WalletModel.find(
          {
            account: new ObjectId(account),
            type: { $in: options.types },
            currency: { $in: options.currencies },
          },
          { session: options?.databaseSession }
        ).project({ transactions: 0 })
      ).map(async (wallet) => {
        if (
          !(await this.compareBalanceDigest(
            wallet.account,
            wallet.type,
            wallet.currency,
            wallet.balance,
            wallet.digest
          ))
        )
          wallet.balance = 0;

        return wallet;
      })
    );
  }

  static async transfer(options: {
    sessionId?: string;
    reference?: string;
    fromName: string | string[];
    from: ObjectId | string;
    toName: string | string[];
    to: ObjectId | string;
    user: ObjectId | string;
    type?: string;
    currency?: string;
    amount: number;
    description?: string;
    status?: TransactionStatus;
    methodOf3DSecurity?: string;
    allowOverdraft?: boolean;
    metadata?: Record<string, any>;
    databaseSession?: ClientSession;
  }) {
    if (typeof options.amount !== "number" || options.amount <= 0)
      throw new Error(`Please provide a valid non-zero positive amount!`);

    if (
      options.sessionId &&
      (await TransactionModel.count({ sessionId: options.sessionId }))
    )
      throw new Error(`Cannot transfer in the same session again!`);

    const Reference =
      options.reference ??
      `TX${10000 + (await Store.incr("wallet-transaction-reference"))}`;

    if (await TransactionModel.count({ reference: Reference }))
      throw new Error(
        `A payment with the same transaction reference '${Reference}' already exists!`
      );

    const FromName =
      options.fromName instanceof Array
        ? options.fromName.filter(Boolean).join(" ")
        : options.fromName;
    const From = options.from.toString();

    const ToName =
      options.toName instanceof Array
        ? options.toName.filter(Boolean).join(" ")
        : options.toName;
    const To = options.to.toString();

    if (From === To) throw new Error(`Cannot transfer to the same wallet!`);

    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    const SubKey = `${Type.toUpperCase()}_${Currency.toUpperCase()}`;
    const [MinTransfer, MaxTransfer] = await Promise.all([
      Env.get(`WALLET_MIN_TRANSFER_${SubKey}`, true),
      Env.get(`WALLET_MAX_TRANSFER_${SubKey}`, true),
    ]);

    const MinTransferAmount = parseFloat(MinTransfer ?? "1");
    const MaxTransferAmount = parseFloat(MaxTransfer ?? "1e500");

    if (options.amount < MinTransferAmount)
      throw new Error(
        `Minimum transfer amount required is ${MinTransferAmount}`
      );

    if (options.amount > MaxTransferAmount)
      throw new Error(
        `Maximum transfer amount allowed is ${MaxTransferAmount}`
      );

    return Database.transaction(async (session) => {
      const WalletA = await this.get(From, {
        type: Type,
        currency: Currency,
        databaseSession: session,
      });

      // Check to allow negative balance
      const PostTransactionBalance = WalletA.balance - options.amount;

      if (
        PostTransactionBalance < 0 &&
        !(await this.hasOverdraftMargin(
          From,
          Type,
          Currency,
          PostTransactionBalance,
          {
            skipAccountCheck: options.allowOverdraft,
          }
        ))
      )
        throw new Error(`Insufficient balance!`);

      const WalletB = await this.get(To, {
        type: Type,
        currency: Currency,
        databaseSession: session,
      });

      // Create a Transaction
      const Transaction = await TransactionModel.create({
        sessionId: options.sessionId,
        reference: Reference,
        fromName: FromName,
        from: new ObjectId(From),
        toName: ToName,
        to: new ObjectId(To),
        description: options.description,
        type: Type,
        currency: Currency,
        createdBy: new ObjectId(options.user),
        methodOf3DSecurity: options.methodOf3DSecurity,
        amount: options.amount,
        status: options.status ?? TransactionStatus.COMPLETED,
        metadata: options.metadata,
      });

      // Debit Balance
      WalletA.balance -= Transaction.amount;
      WalletA.digest = await this.createBalanceDigest(
        WalletA.account,
        WalletA.type,
        WalletA.currency,
        WalletA.balance
      );

      await WalletModel.updateOne(
        { _id: WalletA._id },
        {
          balance: WalletA.balance,
          digest: WalletA.digest,
        },
        { session }
      );

      // Credit Balance
      if (Transaction.status === TransactionStatus.COMPLETED) {
        WalletB.balance += Transaction.amount;
        WalletB.digest = await this.createBalanceDigest(
          WalletB.account,
          WalletB.type,
          WalletB.currency,
          WalletB.balance
        );

        await WalletModel.updateOne(
          { _id: WalletB._id },
          {
            balance: WalletB.balance,
            digest: WalletB.digest,
          },
          { session }
        );
      }

      return {
        wallets: [WalletA, WalletB] as const,
        transaction: Transaction,
      };
    }, options.databaseSession);
  }
}
