import "./base.d.ts";

import "@Core/common/controller/base.ts";
import { SecurityGuard } from "@Lib/securityGuard.ts";
import { TUserOutput } from "@Models/user.ts";
import { TAccountOutput } from "@Models/account.ts";
import { TCollaboratorOutput } from "@Models/collaborator.ts";

export interface SessionInfo {
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
}

export interface Authorization {
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
  collaborator: TCollaboratorOutput;
}

export interface ScopePipeline {
  all: string[];
  available: string[];
  requested: string[];
  permitted: string[];
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RouterState {
  credentials?: AuthCredentials;
  sessionInfo?: SessionInfo;
  authBypass?: boolean;
  auth?: Authorization;
  scopePipeline: ScopePipeline;
  guard: SecurityGuard;
}

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtender {
    state: RouterState;
  }
}
