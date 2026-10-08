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

    const Data = await Response.json() as {
      success?: boolean;
      score?: number;
      action?: string;
    } | null;

    return {
      success: Data?.success === true,
      score: typeof Data?.score === "number" ? Data.score : undefined,
      action: typeof Data?.action === "string" ? Data.action : undefined,
      data: Data,
    };
  } catch (error) {
    return {
      success: false,
      score: undefined,
      action: undefined,
      error,
    };
  }
};

// If this is a global middleware, do not add arguments to the factory function.
export default (options?: {
  oauthAppIdKey?: string;

  /**
   * Reject the request when no oauth app id is resolved, instead of skipping
   * the verification. Without this an attacker just omits the app id.
   */
  required?: boolean;

  /** The reCaptcha v3 action expected on this route. */
  action?: string | ((ctx: RouterContext<string>) => string | undefined);

  /** Minimum reCaptcha v3 score. Defaults to the integration's `minScore` prop, then 0.5. */
  minScore?: number;
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

    if (!OauthAppId) {
      if (options?.required) {
        throw e.error(
          `A ${OauthAppIdKey} is required on this request!`,
        );
      }

      // Continue to next middleware
      return await next();
    }

    const App = await OauthAppModel.findOne(OauthAppId, {
      cache: { key: `oauth-app-integrations:${OauthAppId}`, ttl: 60 * 10 }, // Cache for 10 minutes
    }).project({ integrations: 1 });

    const ReCaptchaV3 = App?.integrations?.find((i) =>
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

      const { success, score, action, data, error } = await verifyRecaptchaV3(
        Query.reCaptchaV3Token,
        ReCaptchaV3.secretKey,
      );

      if (!success) {
        throw new Error("Human verification has been failed!", {
          cause: data ?? error,
        });
      }

      // `success` only means the token was valid. Bots get a valid token too,
      // just with a low score, so the score and action are the actual check.
      const RawMinScore = options?.minScore ??
        parseFloat(ReCaptchaV3.props?.minScore ?? "");
      const MinScore = isNaN(RawMinScore) ? 0.5 : RawMinScore;

      if (typeof score === "number" && score < MinScore) {
        throw new Error("Human verification has been failed!", {
          cause: { score, minScore: MinScore },
        });
      }

      const ExpectedAction = typeof options?.action === "function"
        ? options.action(ctx)
        : options?.action;

      if (ExpectedAction && action !== ExpectedAction) {
        throw new Error("Human verification has been failed!", {
          cause: { action, expectedAction: ExpectedAction },
        });
      }
    }

    // Continue to next middleware
    await next();
  };
};
