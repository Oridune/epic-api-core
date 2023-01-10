import mongoose from "mongoose";
import { IUser } from "./user.ts";
import { IOauthApp } from "./oauth-app.ts";

export enum OauthProvider {
  LOCAL = "local",
}

export interface IOauthSession {
  createdBy?: IUser;
  useragent?: string;
  oauthApp: IOauthApp;
  version: number;
  provider: OauthProvider;
  scope?: string[];
  expiresAt: Date;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const OauthSessionSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    useragent: String,
    oauthApp: { type: mongoose.Types.ObjectId, ref: "OauthApp" },
    version: Number,
    provider: { type: String, enum: OauthProvider },
    scope: { type: [String] },
    expiresAt: Date,
  },
  { timestamps: true, versionKey: false }
);

export const OauthSessionModel = mongoose.model<IOauthSession>(
  "OauthSession",
  OauthSessionSchema
);
