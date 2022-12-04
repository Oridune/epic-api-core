import mongoose from "mongoose";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface IUserModel {
  fname: string;
  mname?: string;
  lname?: string;
  username: string;
  password: string;
  gender?: Gender;
  dob?: Date;
  avatar?: string;
  locale?: string;
  tags: string[];
  lastLogin: Date;
  loginCount: number;
  failedLoginAttempts: number;
  requiresMfa: boolean;
  isBlocked: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUserModel>(
  "User",
  new mongoose.Schema(
    {
      fname: { type: String, required: true },
      mname: String,
      lname: String,
      username: { type: String, required: true, index: { unique: true } },
      password: { type: String, required: true, select: false },
      gender: { type: String, enum: Gender },
      dob: Date,
      avatar: String,
      locale: String,
      tags: [String],
      lastLogin: Date,
      loginCount: { type: Number, default: 0 },
      failedLoginAttempts: { type: Number, default: 0 },
      requiresMfa: { type: Boolean, default: false },
      isBlocked: { type: Boolean, default: false },
      isLocked: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
  )
);
