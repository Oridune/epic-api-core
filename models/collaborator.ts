import mongoose from "mongoose";
import { IUser } from "@Models/user.ts";
import { IAccount } from "@Models/account.ts";

export interface ICollaborator extends mongoose.Document {
  createdBy: IUser;
  createdFor: IUser;
  role: string;
  isPrimary: boolean;
  isOwned: boolean;
  account: IAccount;
  createdAt: Date;
  updatedAt: Date;
}

export const CollaboratorSchema = new mongoose.Schema<ICollaborator>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdFor: { type: mongoose.Types.ObjectId, ref: "user" },
    role: { type: String, required: true },
    isPrimary: { type: Boolean, required: true },
    isOwned: { type: Boolean, required: true },
    account: { type: mongoose.Types.ObjectId, ref: "account" },
  },
  { timestamps: true, versionKey: false }
);

CollaboratorSchema.index({ createdFor: 1, account: 1 });

export const CollaboratorModel = mongoose.model<ICollaborator>("collaborator", CollaboratorSchema);