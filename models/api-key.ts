import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";
import { IAccount } from "@Models/account.ts";

export enum ApiKeyType {
  PUBLISHABLE = "publishable",
  SECRET = "secret",
}

export enum ApiKeyStatus {
  INVOKED = "invoked",
  REVOKED = "revoked",
}

export interface IApiKey {
  createdBy: IUser;
  account: IAccount;
  type: ApiKeyType;
  key: string;
  status: ApiKeyStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ApiKeySchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    account: { type: mongoose.Types.ObjectId, ref: "Account" },
    type: { type: String, enum: ApiKeyType },
    key: { type: String, required: true },
    status: { type: String, enum: ApiKeyStatus },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const ApiKeyModel = mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
