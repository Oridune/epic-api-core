// deno-lint-ignore-file no-explicit-any
import mongoose from "mongoose";
import { IAccount } from "@Models/account.ts";
import { IUser } from "@Models/user.ts";
import { IFile, FileSchema } from "@Models/file.ts";

export interface IOauthConsent extends mongoose.Types.Subdocument {
  logo?: IFile;
  primaryColor: string;
  secondaryColor: string;
  allowedHosts: string[];
  returnUrl: string;
  homepageUrl: string;
  privacyPolicyUrl?: string;
  termsAndConditionsUrl?: string;
  supportUrl?: string;
}

export const OauthConsentSchema = new mongoose.Schema<IOauthConsent>(
  {
    logo: FileSchema,
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    allowedHosts: [{ type: String, required: true }],
    returnUrl: { type: String, required: true },
    homepageUrl: { type: String, required: true },
    privacyPolicyUrl: String,
    termsAndConditionsUrl: String,
    supportUrl: String,
  },
  { _id: false, versionKey: false }
);

export interface IOauthApp extends mongoose.Document {
  account?: IAccount;
  createdBy?: IUser;
  name: string;
  description?: string;
  enabled: boolean;
  consent: IOauthConsent;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export const OauthAppSchema = new mongoose.Schema<IOauthApp>(
  {
    account: { type: mongoose.Types.ObjectId, ref: "account" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    name: { type: String, required: true },
    description: String,
    enabled: { type: Boolean, default: false },
    consent: { type: OauthConsentSchema as any, required: true },
    metadata: Object,
  },
  { timestamps: true, versionKey: false }
);

export const OauthAppModel = mongoose.model<IOauthApp>(
  "oauth-app",
  OauthAppSchema
);
