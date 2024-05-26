import { createHttpError, type RouterContext, Status } from "oak";
import e from "validator";
import { decode } from "encoding/base64.ts";
import OauthController, { OauthTokenType } from "@Controllers/oauth.ts";

export const CredentialsValidator = () =>
  e
    .string()
    .throwsFatal()
    .custom((ctx) => new TextDecoder().decode(decode(ctx.output)).split(":"))
    .custom((ctx) => ({
      username: ctx.output[0] as string,
      password: ctx.output[1] as string,
    }));

export default () =>
async (ctx: RouterContext<string>, next: () => Promise<unknown>) => {
  const Authorization = ctx.request.headers.get("authorization")?.split(" ");

  if (Authorization) {
    const AuthType = Authorization[0].toLowerCase();
    const Token = Authorization[1];

    switch (AuthType) {
      case "basic":
        ctx.state.credentials = await CredentialsValidator().validate(Token, {
          name: "oauth.header.authorization",
        });
        break;

      case "bearer":
        ctx.state.sessionInfo = await OauthController.verifySession({
          type: OauthTokenType.ACCESS,
          token: Token,
          useragent: ctx.request.headers.get("User-Agent") ?? "",
        }).catch((error) => {
          throw createHttpError(Status.Unauthorized, error);
        });
        break;

      case "permit":
        ctx.state.sessionInfo = await OauthController.verifySession({
          type: OauthTokenType.PERMIT,
          token: Token,
          useragent: ctx.request.headers.get("User-Agent") ?? "",
          useragentCheck: false,
        }).catch((error) => {
          throw createHttpError(Status.Unauthorized, error);
        });
        break;

      case "apikey":
        ctx.state.sessionInfo = await OauthController.verifySecret({
          token: Token,
        }).catch((error) => {
          throw createHttpError(Status.Unauthorized, error);
        });
        break;
    }
  }

  // Continue to next middleware
  await next();
};
