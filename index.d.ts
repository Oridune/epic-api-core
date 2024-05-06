import "./base.d.ts";
import "./plugins.d.ts";

import "@Core/common/controller/base.ts";
import { SecurityGuard } from "@Lib/securityGuard.ts";
import { TUserOutput } from "@Models/user.ts";
import { TAccountOutput } from "@Models/account.ts";

type SessionInfo = {
  claims: {
    sessionId: string;
    version: number;
    refreshable?: boolean;
    scopes?: string[];
  };
  session: {
    scopes: Record<string, Array<string>>;
    createdBy: string;
  };
};

type Authorization = {
  sessionId: string;
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

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      sessionInfo?: SessionInfo;
      auth?: Authorization;
      guard: SecurityGuard;
    };
  }
}
