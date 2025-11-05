export type TOauthLogout = {
  sessionId?: string;
  secretId?: string;
  accountId: string;
};

export type TUpdateVerifiedStatus = {
  userId: string;
};

export type TVerifyUser = {
  sessionId?: string;
  secretId?: string;
  accountId?: string;
  verifyTokenPayload: string;
};

export type TUpdatePassword = {
  verifyTokenPayload: string;
};
