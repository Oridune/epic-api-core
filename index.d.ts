// deno-lint-ignore-file no-explicit-any
import "ts-reset";
import "@Core/common/controller/base.ts";
import { IValidatorJSONSchema } from "validator";
import { SecurityGuard } from "./lib/securityGuard.ts";
import { TUserOutput } from "@Models/user.ts";

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
  role: string;
  accountRole: string;
  resolvedRole: string;
  user: Omit<TUserOutput, "password" | "passwordHistory" | "collaborates">;
};

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      sessionInfo?: SessionInfo;
      auth?: Authorization;
      guard: SecurityGuard;
    };
  }

  interface IRequestHandlerObjectExtendor {
    postman?: {
      headers?: { data: Record<string, any>; schema?: IValidatorJSONSchema };
      query?: { data: Record<string, any>; schema?: IValidatorJSONSchema };
      params?: { data: Record<string, any>; schema?: IValidatorJSONSchema };
      body?: { data: Record<string, any>; schema?: IValidatorJSONSchema };
    };

    // Override properties here
  }
}
