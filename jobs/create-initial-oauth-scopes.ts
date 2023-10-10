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
    "users.delete",
    "oauth.logout",
    "oauth.createPermit",
    "users.signAvatar",
    "users.updateAvatar",
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
    "users.signAvatar",
    "users.updateAvatar",
    "users.updateEmail",
    "users.updatePhone",
    "usersIdentification",
  ],
};

export const OauthScopes: Record<string, string[]> = {
  ...DefaultOauthScopes,
};

export const AreArraysIdentical = (arr1: unknown[], arr2: unknown[]) => {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) return false;

  // Convert arrays to sets
  const Set1 = new Set(arr1);
  const Set2 = new Set(arr2);

  // Compare the sets for equality
  for (const Item of Set1) if (!Set2.has(Item)) return false;

  // If all elements match, the arrays contain the same items
  return true;
};

export const SyncOauthScopes = async () => {
  const Scopes = await OauthScopesModel.find({
    role: { $in: Object.keys(OauthScopes) },
  });

  await Promise.all(
    Object.entries(OauthScopes).map(([role, scopes]) => {
      const ExistingScopes = Scopes.find((doc) => doc.role === role)?.scopes;
      const UpdatedScopes = Array.from(
        new Set([...scopes, ...(ExistingScopes ?? [])])
      );

      if (!ExistingScopes || !AreArraysIdentical(UpdatedScopes, scopes))
        return OauthScopesModel.updateOne(
          { role },
          { scopes: UpdatedScopes },
          { upsert: true }
        );
    })
  );
};

export default SyncOauthScopes;
