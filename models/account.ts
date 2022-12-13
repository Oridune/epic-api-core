import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";

export interface IAccount {
  createdBy: IUser;
  createdFor: IUser;
  name: string;
  description?: string;
  // logo?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: String,
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const AccountModel = mongoose.model<IAccount>("Account", AccountSchema);
