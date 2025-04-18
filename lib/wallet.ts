import { Env } from "@Core/common/env.ts";
import { Database } from "@Database";
import * as blakejs from "blakejs";
import { ClientSession, ObjectId } from "mongo";
import { TWalletOutput, WalletModel } from "@Models/wallet.ts";
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

  static async createBalanceDigest(wallet: {
    account: ObjectId | string;
    type: string;
    currency: string;
    balance: number;
  }) {
    const Key = await Env.get("ENCRYPTION_KEY");
    const Target =
      `${Key}:${wallet.account}:${wallet.type}:${wallet.currency}:${wallet.balance}`;

    return blakejs.blake2bHex(Target);
  }

  static async compareBalanceDigest(wallet: TWalletOutput) {
    return (await this.createBalanceDigest(wallet)) === wallet.digest;
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

  static async invalidateTamper(wallet: TWalletOutput, options?: {
    databaseSession?: ClientSession;
  }) {
    if (await this.compareBalanceDigest(wallet)) return wallet;

    const Enabled = await Env.enabled("WALLET_TAMPER_INVALIDATION");

    if (Enabled && typeof wallet.digest !== "string") {
      const NewDigest = await this.createBalanceDigest(wallet);

      await WalletModel.updateOneOrFail(
        {
          _id: wallet._id,
          updatedAt: wallet.updatedAt,
        },
        { digest: NewDigest },
        { session: options?.databaseSession },
      ).catch(() => {
        throw new Error("Balance digest invalidation failed!");
      });

      wallet.digest = NewDigest;

      return wallet;
    }

    throw new Error("Balance tampering detected!");
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
        digest: await this.createBalanceDigest({
          account,
          type: Type,
          currency: Currency,
          balance: Balance,
        }),
      },
      { session: options?.databaseSession },
    );
  }

  static async get(
    account: ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      noResolve?: boolean;
      databaseSession?: ClientSession;
    },
  ) {
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    const filters = {
      account: new ObjectId(account),
      type: Type,
      currency: Currency,
    };

    let Wallet = await WalletModel.findOne(
      filters,
      { session: options?.databaseSession },
    ).project({ transactions: 0 });

    if (!Wallet) {
      if (options?.noResolve) {
        throw new Error("Wallet not found!", { cause: filters });
      }

      Wallet = await this.create(account, options);
    }

    return await this.invalidateTamper(Wallet, options);
  }

  static async list(
    accounts: ObjectId | string | (ObjectId | string)[],
    options?: {
      types?: string[];
      currencies?: string[];
      databaseSession?: ClientSession;
    },
  ) {
    const Accounts = (accounts instanceof Array ? accounts : [accounts]).map(
      (_) => new ObjectId(_),
    );

    if (!Accounts.length) {
      throw new Error("Please provide an account id!");
    }

    const BaseCondition = Accounts.length === 1
      ? Accounts[0]
      : { $in: Accounts };

    return await Promise.all(
      (
        await WalletModel.find(
          {
            account: BaseCondition,
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
        await this.invalidateTamper(wallet, options).catch(() => {
          wallet.balance = 0;
        });

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
     * Provide a custom transactionId.
     */
    transactionId?: ObjectId;

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
     * Amount to be transferred
     */
    amount: number;

    /**
     * Description of the transfer
     */
    description?: string | Record<string, string>;

    /**
     * Check if the wallet exists than make a transaction else throw an error
     */
    checkWalletExist?: boolean;

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
     * Pass any tags to the transaction
     */
    tags?: string[];

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

    const Result = await Database.transaction(async (session) => {
      //! It is required to fetch wallet inside of a transaction for latest balance in case of multiple transfers in the same session
      const WalletA = await this.get(From, {
        type: Type,
        currency: Currency,
        noResolve: options.checkWalletExist,
        databaseSession: session,
      }).catch((cause) => {
        throw new Error("Sender wallet caused an error!", { cause });
      });

      WalletA.balance = this.roundTwo(
        (WalletA.lastBalance = WalletA.balance) - Amount,
      );
      WalletA.lastTxnReference = Reference;

      if (!WalletA.negativeAt && WalletA.balance < 0) {
        WalletA.negativeAt = new Date();
      } else if (WalletA.balance >= 0) {
        WalletA.negativeAt = null;
      }

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
        noResolve: options.checkWalletExist,
        databaseSession: session,
      }).catch((cause) => {
        throw new Error("Receiver wallet caused an error!", { cause });
      });

      WalletB.balance = this.roundTwo(
        (WalletB.lastBalance = WalletB.balance) + Amount,
      );
      WalletB.lastTxnReference = Reference;

      if (!WalletB.negativeAt && WalletB.balance < 0) {
        WalletB.negativeAt = new Date();
      } else if (WalletB.balance >= 0) {
        WalletB.negativeAt = null;
      }

      const [WalletADigest, WalletBDigest] = await Promise.all([
        this.createBalanceDigest(WalletA),
        this.createBalanceDigest(WalletB),
      ]);

      WalletA.digest = WalletADigest;
      WalletB.digest = WalletBDigest;

      // Debit Balance
      const { modifications: modificationsA } = await WalletModel.updateOne(
        {
          _id: WalletA._id,
          updatedAt: WalletA.updatedAt,
        },
        {
          balance: WalletA.balance,
          digest: WalletA.digest,
          lastBalance: WalletA.lastBalance,
          lastTxnReference: WalletA.lastTxnReference,
          negativeAt: WalletA.negativeAt,
        },
        { session },
      );

      WalletA.updatedAt = modificationsA.updatedAt;

      // Credit Balance
      const { modifications: modificationsB } = await WalletModel.updateOne(
        {
          _id: WalletB._id,
          updatedAt: WalletB.updatedAt,
        },
        {
          balance: WalletB.balance,
          digest: WalletB.digest,
          lastBalance: WalletB.lastBalance,
          lastTxnReference: WalletB.lastTxnReference,
          negativeAt: WalletB.negativeAt,
        },
        { session },
      );

      WalletB.updatedAt = modificationsB.updatedAt;

      return {
        wallets: [WalletA, WalletB] as const,

        // Create a Transaction
        transaction: await TransactionModel.create({
          _id: options.transactionId,
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
          senderPreviousBalance: WalletA.lastBalance,
          receiverPreviousBalance: WalletB.lastBalance,
          isRefund: options.isRefund,
          tags: options.tags,
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
     * Provide a custom transactionId for the refund transaction.
     */
    refundTransactionId?: ObjectId;

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
    return await Database.transaction(async (session) => {
      const Transaction = await TransactionModel.findAndUpdateOne(
        options.transactionId,
        { isRefunded: true },
        { session },
      );

      if (!Transaction) throw new Error("Transaction not found!");
      if (Transaction.isRefunded) throw new Error("Cannot refund again!");

      const RefundMessage = "(Refund)";

      return await Wallet.transfer({
        sessionId: options.sessionId,
        transactionId: options.refundTransactionId,
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
          (typeof Transaction.description === "object" &&
              Transaction.description !== null
            ? Object.fromEntries(
              Object.entries(Transaction.description).map((trns) => {
                trns[1] = [
                  RefundMessage,
                  trns[1].replace(RefundMessage, "").trim(),
                ].join(" ");
                return trns;
              }),
            )
            : [
              RefundMessage,
              Transaction.description?.replace(RefundMessage, "")?.trim() ??
                Transaction.reference,
            ].join(" ")),
        metadata: options.metadata,
        allowOverdraft: options.allowOverdraft,
        overdraftLimit: options.overdraftLimit,
        isRefund: true,
        databaseSession: session,
      });
    }, options.databaseSession);
  }
}
