// deno-lint-ignore-file no-explicit-any ban-types
import {
  BaseController,
  Controller,
  Env,
  EnvType,
  Get,
  type IRequestContext,
  Response,
  Store,
  Versioned,
} from "@Core/common/mod.ts";
import { hash } from "ohash";
import { responseValidator } from "@Core/common/validators.ts";
import e from "validator";
import { type RouterContext, Status } from "oak";
import { UserModel, UsernameValidator } from "@Models/user.ts";
import OauthController from "@Controllers/oauth.ts";
import { getNotify } from "@Lib/notifications.ts";
import { I18next } from "@I18n";
import verifyHuman from "@Middlewares/verifyHuman.ts";

export enum IdentificationPurpose {
  VERIFICATION = "verification",
  RECOVERY = "recovery",
}

export enum IdentificationMethod {
  EMAIL = "email",
  PHONE = "phone",
  IN_APP = "in-app",
}

@Controller("/users/identification/", {
  group: "User",
  name: "usersIdentification",
})
export default class UsersIdentificationController extends BaseController {
  /** A 6 digit code has 900,000 values. Keep the window short. */
  static ChallengeExpiryInSeconds = 60 * 10;

  /** Wrong codes allowed on a single challenge before it is burnt. */
  static MaxWrongAttempts = 5;

  /** Minimum wait between two codes for the same user. */
  static ResendCooldownInMs = 60 * 1000;

  // ponytail: the hourly counter's TTL is refreshed on every send (both store
  // backends do this), so it is a sliding hour rather than a fixed one. That
  // is stricter than the spec, not weaker. Use a fixed window if users complain.
  static MaxSendsPerHour = 5;

  /**
   * The server-side half of a challenge. The token alone is a stateless JWT:
   * nothing burns it after use and nothing counts wrong codes, so the code can
   * be brute forced and a used token replayed until it expires.
   */
  static challengeKey(token: string) {
    return `otpChallenge:${hash(token)}`;
  }

  static async sign(
    purpose: IdentificationPurpose | (string & {}),
    method?: IdentificationMethod | null,
    payload?: Record<string, any>,
  ) {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const ExpiresInMs = UsersIdentificationController
      .ChallengeExpiryInSeconds * 1000;

    const Token = (
      await OauthController.createToken({
        type: (method ?? "direct") + "_identification_" + purpose,
        payload: {
          challengeId: crypto.randomUUID(),
          method,
          ...payload,
        },
        secret: OTP.toString(),
        expiresInSeconds:
          UsersIdentificationController.ChallengeExpiryInSeconds,
      })
    ).token;

    const Key = UsersIdentificationController.challengeKey(Token);

    await Store.set(Key, 1, { expiresInMs: ExpiresInMs });

    if (typeof payload?.userId === "string") {
      const CurrentKey = `otpCurrentChallenge:${purpose}:${payload.userId}`;
      const Previous = await Store.get<string>(CurrentKey);

      // Requesting a new code cancels the previous one.
      if (Previous) await Store.del(Previous, `${Previous}:attempts`);

      await Store.set(CurrentKey, Key, { expiresInMs: ExpiresInMs });
    }

    return { token: Token, otp: OTP };
  }

  static async verify<T extends object>(
    token: string,
    code: string | number,
    purpose: IdentificationPurpose,
    method?: IdentificationMethod | null,
  ) {
    const Key = UsersIdentificationController.challengeKey(token);

    if (!(await Store.get(Key))) {
      throw new Error(
        "This code has expired, has already been used, or was cancelled by a newer one! Please request a new code.",
      );
    }

    const Payload = await OauthController.verifyToken<
      T & {
        challengeId: string;
        method?: IdentificationMethod | null;
      }
    >({
      type: (method ?? "direct") + "_identification_" + purpose,
      token,
      secret: code.toString(),
    }).catch(async (error) => {
      const Attempts = await Store.incr(`${Key}:attempts`, {
        expiresInMs: UsersIdentificationController.ChallengeExpiryInSeconds *
          1000,
      });

      // Too many wrong codes, this challenge is done.
      if (Attempts >= UsersIdentificationController.MaxWrongAttempts) {
        await Store.del(Key, `${Key}:attempts`);
      }

      throw error;
    });

    // A code is single use.
    await Store.del(Key, `${Key}:attempts`);

    return Payload;
  }

  static async request(
    purpose: IdentificationPurpose | (string & {}),
    method: IdentificationMethod,
    userFilter: Parameters<(typeof UserModel)["findOne"]>[0],
    metadata?: Record<string, any>,
    language?: string,
  ) {
    if (method === "email") {
      throw new Error("Email notification provider not available yet!");
    }

    const User = await UserModel.findOne(userFilter).project({
      _id: 1,
      [method]: 1,
    });

    if (!User) throw new Error(`User not found!`);

    // Every code costs us an SMS, so limit how often one can be asked for.
    const CooldownKey = `otpCooldown:${purpose}:${User._id}`;
    const CooldownAt = await Store.timestamp(CooldownKey);

    if (typeof CooldownAt === "number") {
      throw Response.statusCode(Status.TooManyRequests).message(
        "Please wait before requesting another code!",
        {
          retryAfterSeconds: Math.max(
            Math.ceil(
              (CooldownAt + UsersIdentificationController.ResendCooldownInMs -
                Date.now()) / 1000,
            ),
            1,
          ),
        },
      );
    }

    const Sends = await Store.incr(`otpSends:${purpose}:${User._id}`, {
      expiresInMs: 60 * 60 * 1000,
    });

    if (Sends > UsersIdentificationController.MaxSendsPerHour) {
      throw Response.statusCode(Status.TooManyRequests).message(
        "You have requested too many codes! Please try again later.",
      );
    }

    await Store.set(CooldownKey, 1, {
      expiresInMs: UsersIdentificationController.ResendCooldownInMs,
    });

    const Challenge = await UsersIdentificationController.sign(
      purpose,
      method,
      { userId: User._id.toString(), ...metadata },
    );

    if (!Env.is(EnvType.TEST)) {
      const notify = await getNotify();
      const t = I18next.translator(language);

      await notify.triggers.trigger({
        body: {
          recipient: {
            contacts: [User.phone!],
          },
          messages: [{
            channel: "sms",
            sms: {
              body: t(
                `Please use this code to verify your account {{otp}}`,
                {
                  otp: Challenge.otp,
                },
              ),
            },
          }],
        },
      }).raw;

      // await Notify.sendWithNovu({
      //   subscriberId: User._id.toString(),
      //   [method]: User[method as "email" | "phone"],
      //   template: method + "-identification-otp",
      //   payload: {
      //     otp: Challenge.otp,
      //   },
      // });
    }

    return Challenge;
  }

  @Get("/methods/me/")
  public methods() {
    return new Versioned().add("1.0.0", {
      shape: () => ({
        return: responseValidator(e.object({
          availableMethods: e.array(e.object({
            type: e.in(Object.values(IdentificationMethod)),
            value: e.string(),
            verified: e.boolean(),
          })),
        })).toSample(),
      }),
      handler: (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        return Response.data({
          availableMethods: [
            {
              type: IdentificationMethod.EMAIL,
              value: ctx.router.state.auth.user.email,
              verified: ctx.router.state.auth.user.isEmailVerified,
            },
            {
              type: IdentificationMethod.PHONE,
              value: ctx.router.state.auth.user.phone,
              verified: ctx.router.state.auth.user.isPhoneVerified,
            },
          ],
        });
      },
    });
  }

  @Get("/methods/:username/", {
    middlewares: () => [
      verifyHuman({ required: true, action: "identificationMethods" }),
    ],
  })
  public publicMethods() {
    // Define Params Schema
    const ParamsSchema = e.object({
      username: UsernameValidator(),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          availableMethods: e.array(e.object({
            type: e.in(Object.values(IdentificationMethod)),
            maskedValue: e.string(),
            verified: e.boolean(),
          })),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "usersRecoveries.params",
        });

        const User = await UserModel.findOne(Params).project({
          email: 1,
          isEmailVerified: 1,
          phone: 1,
          isPhoneVerified: 1,
        });

        if (User) {
          return Response.data({
            availableMethods: [
              {
                type: IdentificationMethod.EMAIL,
                maskedValue: User.email?.replace(
                  /^(\w{3})[\w.-]+@([\w.]+\w)$/,
                  "$1***@$2",
                ),
                verified: User.isEmailVerified,
              },
              {
                type: IdentificationMethod.PHONE,
                maskedValue: User.phone?.replace(
                  /^(\+)\w+(\w{3})$/,
                  "$1*********$2",
                ),
                verified: User.isPhoneVerified,
              },
            ].filter((_) => !!_.maskedValue),
          });
        } else e.error("User not found!");
      },
    });
  }

  @Get("/:purpose/:username/:method/", {
    middlewares: () => [
      verifyHuman({
        required: true,
        // `recovery` or `verification`.
        action: (ctx) => ctx.params.purpose,
      }),
    ],
  })
  public request() {
    // Define Params Schema
    const ParamsSchema = e.object({
      purpose: e.in(Object.values(IdentificationPurpose)),
      username: UsernameValidator(),
      method: e.in(Object.values(IdentificationMethod)),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          token: e.string(),
          otp: e.optional(e.number()),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "usersIdentifications.params",
        });

        const Challenge = await UsersIdentificationController.request(
          Params.purpose,
          Params.method,
          { username: Params.username },
          {},
          ctx.router.lang,
        );

        return Response.data({
          token: Challenge.token,
          otp: Env.is(EnvType.TEST) ? Challenge.otp : undefined,
        });
      },
    });
  }
}
