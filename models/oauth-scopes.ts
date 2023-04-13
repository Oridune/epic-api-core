import mongoose from "mongoose";

export interface IOauthScopes extends mongoose.Document {
  role: string;
  scopes?: string[];
}

export const OauthScopesSchema = new mongoose.Schema<IOauthScopes>(
  {
    role: { type: String, required: true, unique: true },
    scopes: [String],
  },
  { timestamps: false, versionKey: false }
);

export const OauthScopesModel = mongoose.model<IOauthScopes>(
  "oauth-scopes",
  OauthScopesSchema
);
