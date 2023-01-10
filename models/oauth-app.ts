import mongoose from "mongoose";
import { IAccount } from "@Models/account.ts";
import { IUser } from "@Models/user.ts";
import { IFile, FileSchema } from "@Models/file.ts";

export interface IOauthAppMetadata {
  consentPrimaryColor: string;
  consentSecondaryColor: string;
}

export const OauthAppMetadata = new mongoose.Schema({
  consentPrimaryColor: String,
  consentSecondaryColor: String,
});

export interface IOauthApp {
  account?: IAccount;
  createdBy?: IUser;
  name: string;
  displayName: string;
  description: string;
  logo?: IFile;
  returnUrl: string;
  metadata: IOauthAppMetadata;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const OauthAppSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Types.ObjectId, ref: "Account" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    description: String,
    logo: FileSchema,
    homepageUrl: { type: String, required: true },
    returnUrl: { type: String, required: true },
    metadata: OauthAppMetadata,
  },
  { timestamps: true, versionKey: false }
);

export const OauthAppModel = mongoose.model<IOauthApp>(
  "OauthApp",
  OauthAppSchema
);
