import { OauthScopesModel } from "@Models/oauth-scopes.ts";

export default async () => {
  await OauthScopesModel.updateOne(
    { role: "root" },
    { scopes: ["*"] },
    { upsert: true }
  );

  await OauthScopesModel.updateOne(
    { role: "unauthenticated" },
    {
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
    },
    { upsert: true }
  );

  await OauthScopesModel.updateOne(
    { role: "unverified" },
    { scopes: ["oauth.logout"] },
    { upsert: true }
  );

  await OauthScopesModel.updateOne(
    { role: "user" },
    { scopes: ["users.delete", "oauth.logout"] },
    { upsert: true }
  );
};
