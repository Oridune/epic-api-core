// deno-lint-ignore-file no-explicit-any
import "ts-reset";
import "@Core/common/controller/base.ts";
import { IValidatorJSONSchema } from "validator";

declare module "@Core/common/controller/base.ts" {
  interface IRouterContextExtendor {
    state: {
      auth?: {
        userId: string;
        accountId: string;
        role: string;
      };
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
