import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";
import { IFile, FileSchema } from "@Models/file.ts";

export interface IAccount extends mongoose.Document {
  createdBy?: IUser | mongoose.Types.ObjectId;
  createdFor: IUser | mongoose.Types.ObjectId;
  name?: string;
  description?: string;
  logo?: IFile;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = new mongoose.Schema<IAccount>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "user" },
    name: String,
    description: String,
    logo: FileSchema,
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const AccountModel = mongoose.model<IAccount>("account", AccountSchema);
