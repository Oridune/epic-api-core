export type TOauthLogout = {
  sessionId?: string;
  secretId?: string;
  accountId: string;
};

export type TUpdateVerifiedStatus = {
  userId: string
}
