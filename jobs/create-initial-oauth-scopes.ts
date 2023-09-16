import { OauthScopesModel } from "@Models/oauth-scopes.ts";

export default async () => {
  if (!(await OauthScopesModel.exists({ role: "root" })))
    await OauthScopesModel.create({ role: "root", scopes: ["*"] });

  if (!(await OauthScopesModel.exists({ role: "unauthenticated" })))
    await OauthScopesModel.create({
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
    });

  if (!(await OauthScopesModel.exists({ role: "unverified" })))
    await OauthScopesModel.create({
      role: "unverified",
      scopes: [
        "users.get",
        "users.update",
        "oauth.logout",
        "users.updateEmail",
        "users.updatePhone",
      ],
    });

  if (!(await OauthScopesModel.exists({ role: "user" })))
    await OauthScopesModel.create({
      role: "user",
      scopes: [
        "users.get",
        "users.update",
        "users.delete",
        "oauth.logout",
        "users.updateEmail",
        "users.updatePhone",
      ],
    });
};
