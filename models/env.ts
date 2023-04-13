import mongoose from "mongoose";
import { EnvType } from "@Core/common/env.ts";

export interface IEnv extends mongoose.Document {
  type: EnvType | "*";
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export const EnvSchema = new mongoose.Schema<IEnv>(
  {
    type: String,
    key: String,
    value: String,
  },
  { timestamps: true, versionKey: false }
);

export const EnvModel = mongoose.model<IEnv>("env", EnvSchema);
