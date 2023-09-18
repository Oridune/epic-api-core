import { OauthScopesModel } from "@Models/oauth-scopes.ts";

export const DefaultOauthScopes = {
  root: ["*"],
  unauthenticated: [
    "api",
    "oauthApps.getDefault",
    "oauthApps.get",
    "users.create",
    "users.verify",
    "users.updatePassword",
    "oauth",
    "usersIdentification.publicMethods",
    "usersIdentification.request",
  ],
  unverified: [
    "users.get",
    "users.update",
    "oauth.logout",
    "oauth.createPermit",
    "users.updateEmail",
    "users.updatePhone",
    "usersIdentification",
  ],
  user: [
    "users.get",
    "users.update",
    "users.delete",
    "oauth.logout",
    "oauth.createPermit",
    "users.updateEmail",
    "users.updatePhone",
    "usersIdentification",
  ],
};

export const SyncOauthScopes = async () => {
  const ExistingScopes = await OauthScopesModel.find({
    role: { $in: Object.keys(DefaultOauthScopes) },
  });

  await Promise.all(
    Object.entries(DefaultOauthScopes).map(([role, scopes]) =>
      OauthScopesModel.updateOne(
        { role },
        {
          scopes: Array.from(
            new Set([
              ...scopes,
              ...(ExistingScopes.find((doc) => doc.role === role)?.scopes ??
                []),
            ])
          ),
        },
        { upsert: true }
      )
    )
  );
};

export default SyncOauthScopes;
