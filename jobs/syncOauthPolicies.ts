import { OauthPolicyModel } from "@Models/oauthPolicy.ts";

export const DefaultOauthPolicies = {
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
    "wallet.balance",
    "wallet.transactions",
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
    "wallet.signTransfer",
    "wallet.transfer",
    "wallet.balance",
    "wallet.transactions",
  ],
};

export type TOauthPolicies = typeof DefaultOauthPolicies &
  Partial<Record<string, string[]>>;

export const OauthPolicies: TOauthPolicies = {
  ...DefaultOauthPolicies,
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

export const SyncOauthPolicies = async () => {
  const Policies = await OauthPolicyModel.find({
    role: { $in: Object.keys(OauthPolicies) },
  });

  await Promise.all(
    Object.entries(OauthPolicies).map(([role, scopes]) => {
      if (scopes instanceof Array) {
        const ExistingScopes = Policies.find(
          (doc) => doc.role === role
        )?.scopes;
        const UpdatedScopes = Array.from(
          new Set([...scopes, ...(ExistingScopes ?? [])])
        );

        if (
          !ExistingScopes ||
          !AreArraysIdentical(ExistingScopes, UpdatedScopes)
        )
          return OauthPolicyModel.updateOne(
            { role },
            { scopes: UpdatedScopes },
            { upsert: true }
          );
      }
    })
  );
};

export default SyncOauthPolicies;
