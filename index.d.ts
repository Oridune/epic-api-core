// deno-lint-ignore-file no-explicit-any
import "ts-reset";
import "@Core/common/controller/base.ts";

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      auth: {
        userId: string;
        accountId: string;
        role: string;
      };
    };
  }

  interface IRequestHandlerObjectExtendor {
    postman?: {
      headers?: Record<string, any>;
      query?: Record<string, any>;
      params?: Record<string, any>;
      body?: Record<string, any>;
    };

    // Override properties here
  }
}
