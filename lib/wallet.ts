import { Env } from "@Core/common/env.ts";
import { Database } from "@Database";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";
import { AccountModel, IAccount } from "@Models/account.ts";
import { IUser } from "@Models/user.ts";
import { WalletModel } from "@Models/wallet.ts";
import { TransactionModel, TransactionStatus } from "@Models/transaction.ts";
import { Store } from "@Core/common/store.ts";

export class Wallet {
  static getDefaultType() {
    return Env.get("DEFAULT_WALLET_TYPE");
  }

  static async isValidType(type: string) {
    return (
      (await Env.get("SUPPORTED_WALLET_TYPES", true))?.split(/\s*,\s*/) ?? []
    ).includes(type);
  }

  static getDefaultCurrency() {
    return Env.get("DEFAULT_WALLET_CURRENCY");
  }

  static async isValidCurrency(currency: string) {
    return (
      (await Env.get("SUPPORTED_WALLET_CURRENCIES", true))?.split(/\s*,\s*/) ??
      []
    ).includes(currency);
  }

  static async create(
    account: IAccount | mongoose.Types.ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      databaseSession?: mongoose.mongo.ClientSession;
    }
  ) {
    const Account = (
      account instanceof AccountModel ? account._id : account
    ) as mongoose.Types.ObjectId | string;
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    if (!(await this.isValidType(Type)))
      throw new Error(`Invalid wallet type '${Type}'!`);

    if (!(await this.isValidCurrency(Currency)))
      throw new Error(`Invalid currency '${Currency}'!`);

    const Balance = 0;

    return new WalletModel({
      account: Account,
      type: Type,
      currency: Currency,
      balance: Balance,
      digest: await bcrypt.hash(Balance.toString()),
    }).save({ session: options?.databaseSession });
  }

  static async get(
    account: IAccount | mongoose.Types.ObjectId | string,
    options?: {
      type?: string;
      currency?: string;
      databaseSession?: mongoose.mongo.ClientSession;
    }
  ) {
    const Account = (
      account instanceof AccountModel ? account._id : account
    ) as mongoose.Types.ObjectId | string;
    const Type = options?.type ?? (await this.getDefaultType());
    const Currency = options?.currency ?? (await this.getDefaultCurrency());

    let Wallet = await WalletModel.findOne(
      {
        account: Account,
        type: Type,
        currency: Currency,
      },
      { transactions: 0 },
      { session: options?.databaseSession }
    );

    if (!Wallet) Wallet = await this.create(account, options);
    else if (!(await bcrypt.compare(Wallet.balance.toString(), Wallet.digest)))
      throw new Error(`Balance tampering detected!`);

    return Wallet;
  }

  static async transfer(options: {
    sessionId?: string;
    reference?: string;
    fromName: string;
    from: IAccount | mongoose.Types.ObjectId | string;
    toName: string;
    to: IAccount | mongoose.Types.ObjectId | string;
    user: IUser | mongoose.Types.ObjectId | string;
    type?: string;
    currency?: string;
    amount: number;
    description?: string;
    status?: TransactionStatus;
    is3DVerified?: boolean;
    databaseSession?: mongoose.mongo.ClientSession;
  }) {
    if (typeof options.amount !== "number" || options.amount <= 0)
      throw new Error(`Please provide a valid non-zero positive amount!`);

    if (
      options.sessionId &&
      (await TransactionModel.exists({ sessionId: options.sessionId }))
    )
      throw new Error(`Cannot transfer in the same session again!`);

    const Reference =
      options.reference ??
      `TX${10000 + (await Store.incr("wallet-transaction-reference"))}`;

    if (await TransactionModel.exists({ reference: Reference }))
      throw new Error(
        `A payment with the same transaction reference '${Reference}' already exists!`
      );

    const From = (
      options.from instanceof AccountModel ? options.from._id : options.from
    ) as mongoose.Types.ObjectId | string;
    const To = (
      options.to instanceof AccountModel ? options.to._id : options.to
    ) as mongoose.Types.ObjectId | string;

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
      const OverdraftEnabledAccounts =
        (await Env.get("WALLET_OVERDRAFT_ENABLED_ACCOUNTS", true))?.split(
          /\s*,\s*/
        ) ?? [];

      if (
        !OverdraftEnabledAccounts.includes(From.toString()) &&
        WalletA.balance - options.amount < 0
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
        fromName: options.fromName,
        from: From,
        toName: options.toName,
        to: To,
        description: options.description,
        type: Type,
        currency: Currency,
        createdBy: options.user,
        is3DVerified: options.is3DVerified,
        amount: options.amount,
        status: options.status ?? TransactionStatus.COMPLETED,
      });

      // Debit Balance
      WalletA.balance -= Transaction.amount;
      WalletA.digest = await bcrypt.hash(WalletA.balance.toString());
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
        WalletB.digest = await bcrypt.hash(WalletB.balance.toString());
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
