// deno-lint-ignore-file no-explicit-any ban-types
import {
  BaseController,
  Controller,
  Env,
  EnvType,
  Get,
  type IRequestContext,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { responseValidator } from "@Core/common/validators.ts";
import e from "validator";
import { type RouterContext, Status } from "oak";
import { UserModel, UsernameValidator } from "@Models/user.ts";
import OauthController from "@Controllers/oauth.ts";
import { Notify } from "@Lib/notify.ts";

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
  static async sign(
    purpose: IdentificationPurpose | (string & {}),
    method?: IdentificationMethod | null,
    payload?: Record<string, any>,
  ) {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    return {
      token: (
        await OauthController.createToken({
          type: (method ?? "direct") + "_identification_" + purpose,
          payload: {
            challengeId: crypto.randomUUID(),
            method,
            ...payload,
          },
          secret: OTP.toString(),
          expiresInSeconds: 60 * 60, // Expires in 1 hour.
        })
      ).token,
      otp: OTP,
    };
  }

  static verify<T extends object>(
    token: string,
    code: string | number,
    purpose: IdentificationPurpose,
    method?: IdentificationMethod | null,
  ) {
    return OauthController.verifyToken<
      T & {
        challengeId: string;
        method?: IdentificationMethod | null;
      }
    >({
      type: (method ?? "direct") + "_identification_" + purpose,
      token,
      secret: code.toString(),
    });
  }

  static async request(
    purpose: IdentificationPurpose | (string & {}),
    method: IdentificationMethod,
    userFilter: Parameters<(typeof UserModel)["findOne"]>[0],
    metadata?: Record<string, any>,
  ) {
    const User = await UserModel.findOne(userFilter).project({
      _id: 1,
      [method]: 1,
    });

    if (!User) throw new Error(`User not found!`);

    const Challenge = await UsersIdentificationController.sign(
      purpose,
      method,
      { userId: User._id, ...metadata },
    );

    if (!Env.is(EnvType.TEST)) {
      await Notify.sendWithNovu({
        subscriberId: User._id.toString(),
        [method]: User[method as "email" | "phone"],
        template: method + "-identification-otp",
        payload: {
          otp: Challenge.otp,
        },
      });
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

  @Get("/methods/:username/")
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

  @Get("/:purpose/:username/:method/")
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
        );

        return Response.data({
          token: Challenge.token,
          otp: Env.is(EnvType.TEST) ? Challenge.otp : undefined,
        });
      },
    });
  }
}
