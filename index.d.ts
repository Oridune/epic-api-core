import { SecurityGuard } from "@Lib/security-guard.ts";

import "ts-reset";
import "@Core/common/controller/base.ts";

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      guard: SecurityGuard;
      auth?: {
        userId: string;
        accountId: string;
        role: string;
      };
    };
  }
}
