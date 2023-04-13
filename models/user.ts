import mongoose from "mongoose";
import { IOauthApp } from "@Models/oauth-app.ts";
import { IAccess } from "@Models/access.ts";
import { FileSchema, IFile } from "@Models/file.ts";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface IUser extends mongoose.Document {
  oauthApp: IOauthApp;
  fname: string;
  mname?: string;
  lname?: string;
  username: string;
  password: string;
  gender?: Gender;
  dob?: Date;
  avatar?: IFile;
  locale?: string;
  tags: string[];
  lastLogin: Date;
  loginCount: number;
  failedLoginAttempts: number;
  requiresMfa: boolean;
  isBlocked: boolean;
  accesses: IAccess[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new mongoose.Schema<IUser>(
  {
    oauthApp: { type: mongoose.Types.ObjectId, ref: "oauth-app" },
    fname: { type: String, required: true },
    mname: String,
    lname: String,
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: Gender },
    dob: Date,
    avatar: FileSchema,
    locale: String,
    tags: [String],
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    requiresMfa: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    accesses: [{ type: mongoose.Types.ObjectId, ref: "access" }],
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = mongoose.model<IUser>("user", UserSchema);
