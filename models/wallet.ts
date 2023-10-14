import mongoose from "mongoose";
import { IAccount } from "@Models/account.ts";
import { ITransaction } from "@Models/transaction.ts";

export interface IWallet {
  account: IAccount | mongoose.Types.ObjectId;
  type: string;
  currency: string;
  balance: number;
  digest: string;
  transactions: ITransaction[] | mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type IWalletDocument = IWallet & mongoose.Document;

export const WalletSchema = new mongoose.Schema<IWallet>(
  {
    account: { type: mongoose.Types.ObjectId, ref: "account", index: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    balance: { type: Number, required: true },
    digest: { type: String, required: true },
    transactions: [{ type: mongoose.Types.ObjectId, ref: "transaction" }],
  },
  { timestamps: true, versionKey: false }
);

export const WalletModel = mongoose.model<IWallet>("wallet", WalletSchema);
