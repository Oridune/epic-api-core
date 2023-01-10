// deno-lint-ignore-file no-explicit-any
import mongoose from "mongoose";
import { IUser } from "./user.ts";

export interface IActivity {
  createdBy: IUser;
  subject: string;
  payload?: any;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivitySchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    subject: String,
    payload: Object,
  },
  { timestamps: true, versionKey: false }
);

export const ActivityModel = mongoose.model<IActivity>(
  "Activity",
  ActivitySchema
);
