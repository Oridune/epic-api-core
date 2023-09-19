import {
  Env,
  Controller,
  BaseController,
  Get,
  Versioned,
  Response,
  type IRequestContext,
  EnvType,
} from "@Core/common/mod.ts";
import e from "validator";
import { type RouterContext, Status } from "oak";
import { Novu } from "novu";
import { UserModel } from "@Models/user.ts";
import { UsernameValidator } from "@Controllers/users.ts";
import OauthController from "@Controllers/oauth.ts";

export enum IdentificationPurpose {
  VERIFICATION = "verification",
  RECOVERY = "recovery",
}

export enum IdentificationMethod {
  EMAIL = "email",
  PHONE = "phone",
}

@Controller("/users/identification/", { name: "usersIdentification" })
export default class UsersIdentificationController extends BaseController {
  static async request(
    id: string,
    method: IdentificationMethod,
    userFilter: { userId: string }
  ): Promise<{ token: string; otp: number }>;
  static async request(
    id: string,
    method: IdentificationMethod,
    userFilter: { username: string }
  ): Promise<{ token: string; otp: number }>;
  static async request(
    id: string,
    method: IdentificationMethod,
    userFilter: object
  ) {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const User = await UserModel.findOne(userFilter, { _id: 1, [method]: 1 });

    if (!User) throw new Error(`User not found!`);

    if (!Env.is(EnvType.TEST)) {
      const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

      await Notifier.subscribers
        .update(User._id, { [method]: User[method] })
        .catch(() =>
          Notifier.subscribers.identify(User._id, { [method]: User[method] })
        );

      const NovuTemplateId = method + "-identification-otp";

      await Notifier.trigger(NovuTemplateId, {
        to: { subscriberId: User._id },
        payload: {
          otp: OTP,
        },
      }).catch((error) => {
        if (error.response.data.message === "workflow_not_found")
          throw new Error(`Notification workflow template not found!`);
        else throw new Error(error.response.data.message, { cause: error });
      });
    }

    return {
      token: (
        await OauthController.createToken({
          type: method + "_identification_" + id,
          payload: { method, userId: User._id },
          secret: OTP.toString(),
          expiresInSeconds: 60 * 60, // Expires in 1 hour.
        })
      ).token,
      otp: OTP,
    };
  }

  @Get("/methods/me/")
  public methods() {
    return new Versioned().add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        const User = await UserModel.findOne(
          { _id: ctx.router.state.auth.userId },
          {
            email: 1,
            isEmailVerified: 1,
            phone: 1,
            isPhoneVerified: 1,
          }
        );

        if (User) {
          return Response.data({
            availableMethods: [
              {
                type: IdentificationMethod.EMAIL,
                value: User.email,
                verified: User.isEmailVerified,
              },
              {
                type: IdentificationMethod.PHONE,
                value: User.phone,
                verified: User.isPhoneVerified,
              },
            ],
          });
        } else e.error("User not found!");
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
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "usersRecoveries.params",
        });

        const User = await UserModel.findOne(Params, {
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
                  "$1***@$2"
                ),
                verified: User.isEmailVerified,
              },
              {
                type: IdentificationMethod.PHONE,
                maskedValue: User.phone?.replace(
                  /^(\+)\w+(\w{3})$/,
                  "$1*********$2"
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
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "usersIdentifications.params",
        });

        const Signature = await UsersIdentificationController.request(
          Params.purpose,
          Params.method,
          { username: Params.username }
        );

        return Response.data({
          token: Signature.token,
          otp: Env.is(EnvType.TEST) ? Signature.otp : undefined,
        });
      },
    });
  }
}
