import mongoose from "mongoose";
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
  passwordHistory?: string[];
  gender?: Gender;
  dob?: Date;
  avatar?: IFile;
  locale?: string;
  tags: string[];
  email?: string;
  isEmailVerified: boolean;
  phone?: string;
  isPhoneVerified: boolean;
  country?: string;
  state?: string;
  city?: string;
  address_1?: string;
  address_2?: string;
  postalCode?: string;
  lastLogin?: Date;
  loginCount: number;
  failedLoginAttempts: number;
  requiresMfa: boolean;
  isBlocked: boolean;
  collaborates: ICollaborator[];
  deletionAt?: Date | null;
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
    passwordHistory: [{ type: String, select: false }],
    gender: { type: String, enum: Gender },
    dob: Date,
    avatar: FileSchema,
    locale: String,
    tags: [String],
    email: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { email: { $exists: true } },
      },
    },
    isEmailVerified: { type: Boolean, default: false },
    phone: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { phone: { $exists: true } },
      },
    },
    isPhoneVerified: { type: Boolean, default: false },
    country: String,
    state: String,
    city: String,
    address_1: String,
    address_2: String,
    postalCode: String,
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    requiresMfa: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    collaborates: [{ type: mongoose.Types.ObjectId, ref: "collaborator" }],
    deletionAt: Date,
  },
  { timestamps: true, versionKey: false }
);

//! This code doesn't seem to work!
UserSchema.post("init", (user) => {
  if (user.deletionAt instanceof Date)
    // Throw an error if the user is deleted
    throw new Error("Deleted user cannot be fetched!");
});

export const UserModel = mongoose.model<IUser>("user", UserSchema);
