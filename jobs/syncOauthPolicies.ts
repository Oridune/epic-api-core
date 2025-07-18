import { OauthPolicyModel } from "@Models/oauthPolicy.ts";

export const DefaultOauthPolicies = {
  root: ["*"],
  debugger: ["*", "-api"], // Maintenance role (Use in denial context)
  unauthenticated: [
    "api",
    "oauthApps.getDefault",
    "oauthApps.get",
    "oauth",
    "oauthPasskey.challengeLogin",
    "oauthPasskey.login",
    "oauth2FA.authorizeTOTP",
    "users.create",
    "users.verify",
    "users.updatePassword",
    "usersIdentification.publicMethods",
    "usersIdentification.request",
  ],
  unverified: [
    "role:unauthenticated",
    "batcher.request",
    "users.me",
    "users.update",
    "users.delete",
    "oauth.logout",
    "users.signAvatar",
    "users.updateAvatar",
    "users.updateEmail",
    "users.updatePhone",
    "users.setFcmToken",
    "users.deleteFcmToken",
    "oauth.createPermit",
    "oauthPasskey.challengeRegister",
    "oauthPasskey.register",
    "usersIdentification",
    "oauthPolicies.me",
    "wallet.metadata",
    "wallet.balance",
    "wallet.balanceList",
    "wallet.transactions",
    "accountInvites",
    "collaborators.create",
    "collaborators.update",
    "collaborators.get",
    "collaborators.delete",
    "accounts.get",
    "accounts.update",
    "accounts.delete",
    "accounts.updateLogo",
    "oauth2FA.createTOTP",
    "oauth2FA.activateTOTP",
    "oauth2FA.getTOTP",
  ],
  user: [
    "role:unverified",
    "oauthSecrets.create",
    "oauthSecrets.get",
    "oauthSecrets.delete",
    "wallet.signTransfer",
    "wallet.transfer",
  ],
};

export type TOauthPolicies =
  & typeof DefaultOauthPolicies
  & Partial<Record<string, string[]>>;

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
          (doc) => doc.role === role,
        )?.scopes;
        const UpdatedScopes = Array.from(
          new Set([...scopes, ...(ExistingScopes ?? [])]),
        );

        if (
          !ExistingScopes ||
          !AreArraysIdentical(ExistingScopes, UpdatedScopes)
        ) {
          return OauthPolicyModel.updateOne(
            { role },
            { scopes: UpdatedScopes },
            { upsert: true },
          );
        }
      }
    }),
  );
};

export default SyncOauthPolicies;
