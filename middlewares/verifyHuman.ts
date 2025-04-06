import e from "validator";
import { type RouterContext } from "oak";
import { Flags } from "@Core/common/flags.ts";
import { OauthAppModel, SupportedIntegrationId } from "@Models/oauthApp.ts";

export const verifyRecaptchaV3 = async (
  token: string,
  secretKey: string,
) => {
  const Params = new URLSearchParams();

  Params.append("secret", secretKey);
  Params.append("response", token);

  try {
    const Response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: Params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const Data = await Response.json();

    return {
      success: !!(typeof Data === "object" && Data && "success" in Data &&
        Data.success === true),
      data: Data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// If this is a global middleware, do not add arguments to the factory function.
export default (options?: {
  oauthAppIdKey?: string;
}) => {
  const OauthAppIdKey = options?.oauthAppIdKey ?? "oauthAppId";

  return async (ctx: RouterContext<string>, next: () => Promise<unknown>) => {
    if (Flags.noHumanVerification) return await next();

    // Query Validation
    const Query = await e
      .object({
        [OauthAppIdKey]: e.optional(e.string()),
        reCaptchaV3Token: e.optional(e.string()),
      }, { allowUnexpectedProps: true })
      .validate(Object.fromEntries(ctx.request.url.searchParams) ?? {}, {
        name: "query",
      });

    // Params Validation
    const Params = await e.object({
      [OauthAppIdKey]: e.optional(e.string()),
    }, { allowUnexpectedProps: true })
      .validate(ctx.params ?? {}, { name: "params" });

    // Body Validation
    const Body = await e.object({
      [OauthAppIdKey]: e.optional(e.string()),
    }, { allowUnexpectedProps: true })
      .validate(
        (ctx.request.hasBody ? await ctx.request.body.json() : undefined) ?? {},
        {
          name: "body",
        },
      );

    const OauthAppId = Body[OauthAppIdKey] ?? Params[OauthAppIdKey] ??
      Query[OauthAppIdKey];

    if (OauthAppId) {
      const OauthApp = await OauthAppModel.findOne(OauthAppId, {
        cache: { key: `oauth-app-integrations:${OauthAppId}`, ttl: 60 * 10 }, // Cache for 10 minutes
      }).project({ integrations: 1 });

      const ReCaptchaV3 = OauthApp?.integrations?.find((i) =>
        i.enabled && i.id === SupportedIntegrationId.RECAPTCHA_V3
      );

      if (ReCaptchaV3) {
        if (!ReCaptchaV3.secretKey) {
          throw new Error("A reCaptchaV3 secret key not found on the app!");
        }

        if (!Query.reCaptchaV3Token) {
          throw e.error(
            "A reCaptchaV3 integration is enabled on this app! Please provide a valid reCaptchaV3 verification token.",
          );
        }

        const { success, data, error } = await verifyRecaptchaV3(
          Query.reCaptchaV3Token,
          ReCaptchaV3.secretKey,
        );

        if (!success) {
          throw new Error("Human verification has been failed!", {
            cause: data ?? error,
          });
        }
      }
    }

    // Continue to next middleware
    await next();
  };
};
