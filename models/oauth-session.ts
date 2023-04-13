import mongoose from "mongoose";
import { IUser } from "./user.ts";
import { IOauthApp } from "./oauth-app.ts";

export enum OauthProvider {
  LOCAL = "local",
}

export interface IOauthSession extends mongoose.Document {
  createdBy?: IUser;
  useragent?: string;
  oauthApp: IOauthApp;
  version: number;
  provider: OauthProvider;
  scopes: Record<string, string[]>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const OauthSessionSchema = new mongoose.Schema<IOauthSession>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    useragent: String,
    oauthApp: { type: mongoose.Types.ObjectId, ref: "oauth-app" },
    version: Number,
    provider: { type: String, enum: OauthProvider },
    scopes: { type: Object, required: true },
    expiresAt: Date,
  },
  { timestamps: true, versionKey: false }
);

export const OauthSessionModel = mongoose.model<IOauthSession>(
  "oauth-session",
  OauthSessionSchema
);
