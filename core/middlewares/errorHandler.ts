// deno-lint-ignore-file no-explicit-any
import { Context, isHttpError, Status } from "oak";
import { ValidationException } from "validator";
import { Response, Env, EnvType, RawResponse } from "@Core/common/mod.ts";

export const respondWith = (
  ctx: Context<Record<string, any>, Record<string, any>>,
  response: Response | RawResponse
) => {
  ctx.response.status = response.getStatusCode();
  ctx.response.headers = response.getHeaders();
  ctx.response.body = response.getBody();
};

export const errorHandler =
  () =>
  async (
    ctx: Context<Record<string, any>, Record<string, any>>,
    next: () => Promise<unknown>
  ) => {
    try {
      await next();
    } catch (error) {
      const StatusCode = isHttpError(error)
        ? error.status
        : error instanceof ValidationException
        ? Status.BadRequest
        : Status.InternalServerError;
      const ResponseObject = Response.statusCode(StatusCode)
        .messages(error.issues ?? [{ message: error.message }])
        .errorStack(
          !Env.is(EnvType.PRODUCTION) && StatusCode > 499
            ? error.stack
            : undefined
        );

      Object.entries<string>(error).forEach(
        ([key, value]) =>
          /^x-.*/i.test(key) && ResponseObject.header(key, value)
      );

      respondWith(ctx, ResponseObject);
    }
  };