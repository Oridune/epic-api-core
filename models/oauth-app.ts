// deno-lint-ignore-file no-explicit-any
import mongoose from "mongoose";
import { IAccount } from "@Models/account.ts";
import { IUser } from "@Models/user.ts";
import { IFile, FileSchema } from "@Models/file.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";

export interface IOauthConsentStyling extends mongoose.Types.Subdocument {
  roundness?: number;
}

export const OauthConsentStylingSchema =
  new mongoose.Schema<IOauthConsentStyling>(
    {
      roundness: Number,
    },
    { _id: false, versionKey: false }
  );

export interface IOauthConsent extends mongoose.Types.Subdocument {
  requiredIdentificationMethods: IdentificationMethod[];
  logo?: IFile;
  primaryColor: string;
  primaryColorDark?: string;
  secondaryColor: string;
  secondaryColorDark?: string;
  styling?: IOauthConsentStyling;
  allowedCallbackURLs: string[];
  homepageURL: string;
  privacyPolicyURL?: string;
  termsAndConditionsURL?: string;
  supportURL?: string;
}

export const OauthConsentSchema = new mongoose.Schema<IOauthConsent>(
  {
    requiredIdentificationMethods: [
      { type: String, enum: IdentificationMethod, required: true },
    ],
    logo: FileSchema,
    primaryColor: { type: String, required: true },
    primaryColorDark: String,
    secondaryColor: { type: String, required: true },
    secondaryColorDark: String,
    styling: OauthConsentStylingSchema,
    allowedCallbackURLs: [{ type: String, required: true }],
    homepageURL: { type: String, required: true },
    privacyPolicyURL: String,
    termsAndConditionsURL: String,
    supportURL: String,
  },
  { _id: false, versionKey: false }
);

export interface IOauthApp extends mongoose.Document {
  account?: IAccount | mongoose.Types.ObjectId;
  createdBy?: IUser | mongoose.Types.ObjectId;
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
