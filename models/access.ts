import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";
import { IAccount } from "@Models/account.ts";

export interface IAccess extends mongoose.Document {
  createdBy: IUser;
  createdFor: IUser;
  role: string;
  isPrimary: boolean;
  isOwned: boolean;
  account: IAccount;
  createdAt: Date;
  updatedAt: Date;
}

export const AccessSchema = new mongoose.Schema<IAccess>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "user" },
    role: { type: String, required: true },
    isPrimary: { type: Boolean, required: true },
    isOwned: { type: Boolean, required: true },
    account: { type: mongoose.Types.ObjectId, ref: "account" },
  },
  { timestamps: true, versionKey: false }
);

AccessSchema.index({ createdFor: 1, account: 1 });

export const AccessModel = mongoose.model<IAccess>("access", AccessSchema);
