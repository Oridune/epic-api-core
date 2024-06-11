import { Env } from "@Core/common/env.ts";
import { Database } from "@Database";
import * as bcrypt from "bcrypt";
import { ClientSession, ObjectId } from "mongo";
import { WalletModel } from "@Models/wallet.ts";
import { TransactionModel } from "@Models/transaction.ts";
import { Store } from "@Core/common/store.ts";
import { Events } from "@Core/common/events.ts";

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
    balance: number,
  ) {
    return bcrypt.hash(
      `${await Env.get(
        "ENCRYPTION_KEY",
      )}:${account}:${type}:${currency}:${balance}`,
    );
  }

  static async compareBalanceDigest(
    account: ObjectId | string,
    type: string,
    currency: string,
    balance: number,
    digest: string,
  ) {
    return bcrypt.compare(
      `${await Env.get(
        "ENCRYPTION_KEY",
      )}:${account}:${type}:${currency}:${balance}`,
      digest,
    );
  }

  static async hasOverdraftMargin(
    account: ObjectId | string,
    type: string,
    currency: string,
    postTransactionBalance: number,
    options?: {
      skipAccountCheck?: boolean;
      overdraftLimit?: number;
    },
  ) {
    if (!options?.skipAccountCheck) {
      const Accounts =
        (await Env.get("WALLET_OVERDRAFT_ENABLED_ACCOUNTS", true))?.split(
          /\s*,\s*/,
        ) ?? [];

      if (!Accounts.includes(account.toString())) return false;
    }

    if (typeof options?.overdraftLimit === "number") {
      return postTransactionBalance >= options.overdraftLimit;
    }

    const RawLimit = (await Env.get(
      `WALLET_OVERDRAFT_LIMIT_${type.toUpperCase()}_${currency.toUpperCase()}`,
      true,
    )) ?? (await Env.get(`WALLET_OVERDRAFT_LIMIT`, true));

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
    },
  ) {
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    if (!(await this.isValidType(Type))) {
      throw new Error(`Invalid wallet type '${Type}'!`);
    }

    if (!(await this.isValidCurrency(Currency))) {
      throw new Error(`Invalid currency '${Currency}'!`);
    }

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
          Balance,
        ),
      },
      { session: options?.databaseSession },
    );
  }

  static async get(
    account: ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      databaseSession?: ClientSession;
    },
  ) {
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    let Wallet = await WalletModel.findOne(
      {
        account: new ObjectId(account),
        type: Type,
        currency: Currency,
      },
      { session: options?.databaseSession },
    ).project({ transactions: 0 });

    if (!Wallet) Wallet = await this.create(account, options);
    else if (
      !(await this.compareBalanceDigest(
        Wallet.account,
        Wallet.type,
        Wallet.currency,
        Wallet.balance,
        Wallet.digest,
      ))
    ) {
      throw new Error(`Balance tampering detected!`);
    }

    return Wallet;
  }

  static async list(
    account: ObjectId | string,
    options?: {
      types?: string[];
      currencies?: string[];
      databaseSession?: ClientSession;
    },
  ) {
    return await Promise.all(
      (
        await WalletModel.find(
          {
            account: new ObjectId(account),
            ...(options?.types instanceof Array
              ? { type: { $in: options.types } }
              : {}),
            ...(options?.currencies instanceof Array
              ? { currency: { $in: options.currencies } }
              : {}),
          },
          { session: options?.databaseSession },
        ).project({ transactions: 0 })
      ).map(async (wallet) => {
        if (
          !(await this.compareBalanceDigest(
            wallet.account,
            wallet.type,
            wallet.currency,
            wallet.balance,
            wallet.digest,
          ))
        ) {
          wallet.balance = 0;
        }

        return wallet;
      }),
    );
  }

  static roundTwo(amount: number) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }

  static async transfer(options: {
    /**
     * A sessionId can be used to identify a unique payment session.
     */
    sessionId?: string;

    /**
     * Reference is calculated automatically by default (TX10001). But you can pass a custom reference also.
     */
    reference?: string;

    /**
     * You can optionally pass a foreignRefType and a foreignRef to reference an external object that is linked to this transaction.
     */
    foreignRefType?: string;

    /**
     * You can optionally pass a foreignRefType and a foreignRef to reference an external object that is linked to this transaction.
     */
    foreignRef?: string;

    /**
     * Full name of the payment sender
     */
    fromName: string | string[];

    /**
     * Sender's accountId
     */
    from: ObjectId | string;

    /**
     * Sender's userId
     */
    sender: ObjectId | string;

    /**
     * Full name of the payment receiver
     */
    toName: string | string[];

    /**
     * Receiver's accountId
     */
    to: ObjectId | string;

    /**
     * Receiver's userId
     */
    receiver: ObjectId | string;

    /**
     * Executer's userId
     */
    user?: ObjectId | string;

    /**
     * Wallet type
     */
    type?: string;

    /**
     * Wallet currency
     */
    currency?: string;

    /**
     * Amount to be transfered
     */
    amount: number;

    /**
     * Description of the transfer
     */
    description?: string | Record<string, string>;

    /**
     * Which method was used for 3D verification (Also indicates if a 3D verification has been taken or not)
     */
    methodOf3DSecurity?: string;

    /**
     * A negative transaction will be performed in case of insufficient balance
     */
    allowOverdraft?: boolean;

    /**
     * How much negative transaction is allowed?
     */
    overdraftLimit?: number;

    /**
     * Is this transfer a refund?
     */
    isRefund?: boolean;

    /**
     * Pass any metadata to the transaction
     */
    metadata?: Record<string, string | number | boolean>;

    /**
     * Pass a database transaction session
     */
    databaseSession?: ClientSession;
  }) {
    if (typeof options.amount !== "number" || options.amount <= 0) {
      throw new Error(`Please provide a valid non-zero positive amount!`);
    }

    // Fix floating-point errors
    const Amount = this.roundTwo(options.amount);

    const Reference = options.reference ??
      `TX${10000 + (await Store.incr("wallet-transaction-reference"))}`;

    const FromName = options.fromName instanceof Array
      ? options.fromName.filter(Boolean).join(" ")
      : options.fromName;
    const From = options.from.toString();

    const ToName = options.toName instanceof Array
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

    if (Amount < MinTransferAmount) {
      throw new Error(
        `Minimum transfer amount required is ${MinTransferAmount}`,
      );
    }

    if (Amount > MaxTransferAmount) {
      throw new Error(
        `Maximum transfer amount allowed is ${MaxTransferAmount}`,
      );
    }

    const WalletA = await this.get(From, {
      type: Type,
      currency: Currency,
    });

    WalletA.balance = this.roundTwo(WalletA.balance - Amount);

    if (
      WalletA.balance < 0 &&
      !(await this.hasOverdraftMargin(
        From,
        Type,
        Currency,
        WalletA.balance,
        {
          skipAccountCheck: options.allowOverdraft,
          overdraftLimit: options.overdraftLimit,
        },
      ))
    ) throw new Error(`Insufficient balance!`);

    const WalletB = await this.get(To, {
      type: Type,
      currency: Currency,
    });

    WalletB.balance = this.roundTwo(WalletB.balance + Amount);

    const [WalletADigest, WalletBDigest] = await Promise.all([
      this.createBalanceDigest(
        WalletA.account,
        WalletA.type,
        WalletA.currency,
        WalletA.balance,
      ),
      this.createBalanceDigest(
        WalletB.account,
        WalletB.type,
        WalletB.currency,
        WalletB.balance,
      ),
    ]);

    const Result = await Database.transaction(async (session) => {
      // Debit Balance
      await WalletModel.updateOne(
        WalletA._id,
        {
          balance: WalletA.balance,
          digest: WalletADigest,
        },
        { session },
      );

      // Credit Balance
      await WalletModel.updateOne(
        WalletB._id,
        {
          balance: WalletB.balance,
          digest: WalletBDigest,
        },
        { session },
      );

      return {
        wallets: [WalletA, WalletB] as const,

        // Create a Transaction
        transaction: await TransactionModel.create({
          sessionId: options.sessionId,
          reference: Reference,
          foreignRefType: options.foreignRefType,
          foreignRef: options.foreignRef,
          fromName: FromName,
          from: From,
          sender: options.sender,
          toName: ToName,
          to: To,
          receiver: options.receiver,
          description: options.description,
          type: Type,
          currency: Currency,
          methodOf3DSecurity: options.methodOf3DSecurity,
          amount: Amount,
          isRefund: options.isRefund,
          metadata: options.metadata,
          createdBy: options.user ?? options.sender,
        }, { session }),
      };
    }, options.databaseSession);

    Events.dispatch("wallet.transfer", { detail: Result });

    return Result;
  }

  static async refund(options: {
    /**
     * A sessionId can be used to identify a unique payment session.
     */
    sessionId?: string;

    /**
     * Reference is calculated automatically by default (TX10001). But you can pass a custom reference also.
     */
    reference?: string;

    /**
     * You can optionally pass a foreignRefType and a foreignRef to reference an external object that is linked to this transaction.
     */
    foreignRefType?: string;

    /**
     * You can optionally pass a foreignRefType and a foreignRef to reference an external object that is linked to this transaction.
     */
    foreignRef?: string;

    /**
     * Transaction ID to be refunded
     */
    transactionId: ObjectId | string;

    /**
     * Executer's userId
     */
    user: ObjectId | string;

    /**
     * Description of the transfer
     */
    description?: string | Record<string, string>;

    /**
     * A negative transaction will be performed in case of insufficient balance
     */
    allowOverdraft?: boolean;

    /**
     * How much negative transaction is allowed?
     */
    overdraftLimit?: number;

    /**
     * Pass any metadata to the transaction
     */
    metadata?: Record<string, string | number | boolean>;

    /**
     * Pass a database transaction session
     */
    databaseSession?: ClientSession;
  }) {
    const Transaction = await TransactionModel.findOne(options.transactionId);

    if (!Transaction) throw new Error("A completed transaction was not found!");

    return await Wallet.transfer({
      sessionId: options.sessionId,
      reference: options.reference,
      foreignRefType: options.foreignRefType,
      foreignRef: options.foreignRef,
      type: Transaction.type,
      fromName: Transaction.toName,
      from: Transaction.to,
      sender: Transaction.receiver,
      toName: Transaction.fromName,
      to: Transaction.from,
      receiver: Transaction.sender,
      user: options.user,
      currency: Transaction.currency,
      amount: Transaction.amount,
      description: options.description ??
        (typeof Transaction.description === "object"
          ? Object.fromEntries(
            Object.entries(Transaction.description).map((trns) => {
              trns[1] = ["(Refund)", trns[1]].join(" ");
              return trns;
            }),
          )
          : ["(Refund)", Transaction.description].join(" ")),
      metadata: options.metadata,
      allowOverdraft: options.allowOverdraft,
      overdraftLimit: options.overdraftLimit,
      isRefund: true,
      databaseSession: options.databaseSession,
    });
  }
}
