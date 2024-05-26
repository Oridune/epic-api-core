import "./base.d.ts";

import "@Core/common/controller/base.ts";
import { SecurityGuard } from "@Lib/securityGuard.ts";
import { TUserOutput } from "@Models/user.ts";
import { TAccountOutput } from "@Models/account.ts";

type SessionInfo = {
  claims: {
    secretId?: string;
    sessionId?: string;
    version?: number;
    refreshable?: boolean;
    scopes?: string[];
  };
  session?: {
    scopes: Record<string, Array<string>>;
    createdBy: string;
  };
  secret?: {
    scopes: Record<string, Array<string>>;
    createdBy: string;
  };
};

type Authorization = {
  secretId?: string;
  sessionId?: string;
  userId: string;
  accountId: string;
  isAccountOwned: boolean;
  isAccountPrimary: boolean;
  role: string;
  accountRole: string;
  resolvedRole: string;
  user: Omit<TUserOutput, "password" | "passwordHistory" | "collaborates">;
  account: TAccountOutput;
};

type ScopePipeline = {
  all: string[];
  available: string[];
  requested: string[];
  permitted: string[];
};

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      credentials?: {
        username: string;
        password: string;
      };
      sessionInfo?: SessionInfo;
      auth?: Authorization;
      scopePipeline: ScopePipeline;
      guard: SecurityGuard;
    };
  }
}
