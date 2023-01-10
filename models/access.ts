import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";
import { IAccount } from "@Models/account.ts";

export interface IAccess {
  createdBy: IUser;
  createdFor: IUser;
  role: string;
  isPrimary: boolean;
  isOwned: boolean;
  account: IAccount;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const AccessSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "User" },
    role: { type: String, required: true },
    isPrimary: { type: Boolean, required: true },
    isOwned: { type: Boolean, required: true },
    account: { type: mongoose.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true, versionKey: false }
);

export const AccessModel = mongoose.model<IAccess>("Access", AccessSchema);
