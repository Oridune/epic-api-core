import { createHttpError, type RouterContext, Status } from "oak";
import e from "validator";
import { Env } from "@Core/common/env.ts";
import { decodeBase64 } from "encoding/base64.ts";
import OauthController, { OauthTokenType } from "@Controllers/oauth.ts";
import OauthSecretsController from "@Controllers/oauthSecrets.ts";

export const CredentialsValidator = () =>
  e.string()
    .throwsFatal()
    .custom((ctx) =>
      new TextDecoder().decode(decodeBase64(ctx.output)).split(":")
    )
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

    const DisableAuthMethods = await Env.list("DISABLED_AUTHORIZATION_METHODS");

    if (DisableAuthMethods.includes(AuthType)) {
      throw createHttpError(Status.ServiceUnavailable);
    }

    if (AuthType === "bearer") {
      ctx.state.sessionInfo = await OauthController.verifySession({
        type: OauthTokenType.ACCESS,
        token: Token,
        useragent: ctx.request.headers.get("User-Agent") ?? "",
      }).catch((error: Error) => {
        throw createHttpError(Status.Unauthorized, String(error));
      });
    } else {
      // Other auth types
      switch (AuthType) {
        case "basic":
          ctx.state.credentials = await CredentialsValidator().validate(Token, {
            name: "oauth.header.authorization",
          });
          break;

        case "permit":
          ctx.state.sessionInfo = await OauthController.verifySession({
            type: OauthTokenType.PERMIT,
            token: Token,
            useragent: ctx.request.headers.get("User-Agent") ?? "",
            useragentCheck: false,
          }).catch((error: Error) => {
            throw createHttpError(Status.Unauthorized, String(error));
          });
          break;

        case "apikey":
          ctx.state.sessionInfo = await OauthSecretsController.verifySecret({
            token: Token,
          }).catch((error: Error) => {
            throw createHttpError(Status.Unauthorized, String(error));
          });
          break;

        case "bypass": {
          if (Token !== await Env.get("ENCRYPTION_KEY")) {
            throw createHttpError(Status.Unauthorized, "Invalid bypass token");
          }

          ctx.state.authBypass = true;

          break;
        }
      }
    }
  }

  // Continue to next middleware
  await next();
};
