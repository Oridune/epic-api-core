export type TOauthLogout = {
  sessionId?: string;
  secretId?: string;
  accountId: string;
};

export type TUpdateVerifiedStatus = {
  userId: string
}

export type TVerifyUser = {
  status: string;
  sessionId?: string;
  secretId?: string;
  accountId?: string;
  verifyTokenPayload: string;
}

export type TUpdatePassword = {
  status: string;
  verifyTokenPayload: string;
}
