import mongoose from "mongoose";
import { IUser } from "./user.ts";

export enum ApiKeyStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export interface IApiKey {
  createdBy: IUser;
  secret: string;
  status: ApiKeyStatus;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ApiKeySchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    secret: { type: String, required: true },
    status: { type: String, enum: ApiKeyStatus },
  },
  { timestamps: true, versionKey: false }
);

export const ApiKeyModel = mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
