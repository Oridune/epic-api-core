import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";

export interface IAccount extends mongoose.Document {
  createdBy: IUser;
  createdFor: IUser;
  name?: string;
  description?: string;
  // logo?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = new mongoose.Schema<IAccount>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "user" },
    name: String,
    description: String,
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const AccountModel = mongoose.model<IAccount>("account", AccountSchema);
