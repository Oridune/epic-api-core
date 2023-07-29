import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { IOauthApp } from "@Models/oauth-app.ts";
import { ICollaborator } from "@Models/collaborator.ts";
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
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  lastLogin: Date;
  loginCount: number;
  failedLoginAttempts: number;
  requiresMfa: boolean;
  isBlocked: boolean;
  collaborates: ICollaborator[];
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
    email: String,
    isEmailVerified: { type: Boolean, default: false },
    phone: String,
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    requiresMfa: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    collaborates: [{ type: mongoose.Types.ObjectId, ref: "collaborator" }],
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (next) {
  this.password = this.isModified("password")
    ? await bcrypt.hash(this.username + this.password)
    : this.password;
  next();
});

export const UserModel = mongoose.model<IUser>("user", UserSchema);
