import { type RouterContext } from "oak";
import e from "validator";
import { decode } from "encoding/base64.ts";

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

      if (AuthType === "bearer") {
      } else if (AuthType === "basic")
        ctx.state.credentials = await CredentialsValidator().validate(Token, {
          name: "oauth.header.authorization",
        });
    }

    // Continue to next middleware
    await next();
  };
