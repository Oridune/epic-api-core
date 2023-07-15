import { OauthScopesModel } from "../models/oauth-scopes.ts";

export default async () => {
  if (!(await OauthScopesModel.exists({ role: "root" })))
    await new OauthScopesModel({ role: "root", scopes: ["*"] }).save();

  if (!(await OauthScopesModel.exists({ role: "unauthenticated" })))
    await new OauthScopesModel({
      role: "unauthenticated",
      scopes: ["api", "oauthApps.getDefault", "users.create", "oauth"],
    }).save();

  if (!(await OauthScopesModel.exists({ role: "user" })))
    await new OauthScopesModel({ role: "user" }).save();
};
