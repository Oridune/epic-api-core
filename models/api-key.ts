import mongoose from "mongoose";
import { IUser } from "./user.ts";

export enum ApiKeyStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export interface IApiKey extends mongoose.Document {
  createdBy: IUser;
  secret: string;
  status: ApiKeyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const ApiKeySchema = new mongoose.Schema<IApiKey>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    secret: { type: String, required: true },
    status: { type: String, enum: ApiKeyStatus },
  },
  { timestamps: true, versionKey: false }
);

export const ApiKeyModel = mongoose.model<IApiKey>("api-key", ApiKeySchema);
