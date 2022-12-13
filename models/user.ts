import mongoose from "mongoose";
import { IAccess } from "@Models/access.ts";
import { IAccount } from "@Models/account.ts";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface IUser {
  fname: string;
  mname?: string;
  lname?: string;
  username: string;
  password: string;
  gender?: Gender;
  dob?: Date;
  // avatar?: string;
  locale?: string;
  tags: string[];
  lastLogin: Date;
  loginCount: number;
  failedLoginAttempts: number;
  requiresMfa: boolean;
  isBlocked: boolean;
  isLocked: boolean;
  account?: IAccount;
  accesses: IAccess[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    mname: String,
    lname: String,
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: Gender },
    dob: Date,
    locale: String,
    tags: [String],
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    requiresMfa: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    account: { type: mongoose.Types.ObjectId, ref: "Account" },
    accesses: [{ type: mongoose.Types.ObjectId, ref: "Access" }],
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
