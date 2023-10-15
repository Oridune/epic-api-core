import mongoose from "mongoose";
import { IAccount } from "@Models/account.ts";
import { IUser } from "@Models/user.ts";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ITransaction {
  sessionId?: string;
  reference: string;
  fromName: string;
  from: IAccount | mongoose.Types.ObjectId;
  toName: string;
  to: IAccount | mongoose.Types.ObjectId;
  description: string;
  type: string;
  currency: string;
  amount: number;
  status: TransactionStatus;
  is3DVerified: boolean;
  createdBy: IUser | mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ITransactionDocument = ITransaction & mongoose.Document;

export const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    sessionId: { type: String, unique: true },
    reference: { type: String, required: true, unique: true },
    fromName: { type: String, required: true },
    from: { type: mongoose.Types.ObjectId, ref: "account", index: true },
    toName: { type: String, required: true },
    to: { type: mongoose.Types.ObjectId, ref: "account", index: true },
    description: String,
    type: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: TransactionStatus, required: true },
    is3DVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true, versionKey: false }
);

TransactionSchema.index({
  reference: "text",
  fromName: "text",
  toName: "text",
  description: "text",
  amount: "text",
});

export const TransactionModel = mongoose.model<ITransaction>(
  "transaction",
  TransactionSchema
);
