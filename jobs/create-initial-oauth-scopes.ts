import { OauthScopesModel } from "../models/oauth-scopes.ts";

export default async () => {
  if (!(await OauthScopesModel.exists({ role: "root" })))
    await new OauthScopesModel({ role: "root", scopes: ["*"] }).save();

  if (!(await OauthScopesModel.exists({ role: "unauthenticated" })))
    await new OauthScopesModel({
      role: "unauthenticated",
      scopes: [
        "api",
        "oauthApps.getDefault",
        "oauthApps.get",
        "users.create",
        "users.verify",
        "users.updatePassword",
        "oauth",
        "usersIdentification",
      ],
    }).save();

  if (!(await OauthScopesModel.exists({ role: "unverified" })))
    await new OauthScopesModel({ role: "unverified" }).save();

  if (!(await OauthScopesModel.exists({ role: "user" })))
    await new OauthScopesModel({
      role: "user",
      scopes: ["users.delete"],
    }).save();
};
