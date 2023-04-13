// deno-lint-ignore-file no-explicit-any
import mongoose from "mongoose";
import { IUser } from "./user.ts";

export interface IActivity extends mongoose.Document {
  createdBy: IUser;
  subject: string;
  payload?: any;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivitySchema = new mongoose.Schema<IActivity>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    subject: String,
    payload: Object,
  },
  { timestamps: true, versionKey: false }
);

export const ActivityModel = mongoose.model<IActivity>(
  "activity",
  ActivitySchema
);
