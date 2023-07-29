import {
  Env,
  Controller,
  BaseController,
  Get,
  Post,
  Versioned,
  Response,
  type IRequestContext,
} from "@Core/common/mod.ts";
import e from "validator";
import { Status, type RouterContext } from "oak";
import { Novu } from "novu";
import { UserModel } from "@Models/user.ts";
import OauthController from "@Controllers/oauth.ts";

export enum VerificationType {
  EMAIL = "email",
  PHONE = "phone",
}

@Controller("/users/verifications/", {
  group: "Users",
  name: "usersVerifications",
})
export default class UsersVerificationsController extends BaseController {
  static async requestVerification(type: VerificationType, userId: string) {
    const Notifier = new Novu(await Env.get("NOVU_API_KEY"));
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    const User = await UserModel.findOne({ _id: userId }, { [type]: 1 });

    if (!User) throw new Error(`User not found!`);

    await Notifier.subscribers.update(userId, { [type]: User[type] });

    const NovuTemplateId = type + "-verification-otp";

    await Notifier.trigger(NovuTemplateId, {
      to: { subscriberId: userId },
      payload: {
        verificationCode: VerificationCode,
      },
    }).catch((error) => {
      if (error.response.data.message === "workflow_not_found")
        throw new Error(`Notification workflow template not found!`);
      else throw new Error(error.response.data.message, { cause: error });
    });

    return (
      await OauthController.createToken({
        type: type + "_verification",
        payload: { type, userId },
        secret: VerificationCode.toString() + userId,
      })
    ).token;
  }

  static async verify(type: VerificationType, userId: string) {
    switch (type) {
      case VerificationType.EMAIL:
        await UserModel.updateOne({ _id: userId }, { isEmailVerified: true });
        break;

      case VerificationType.PHONE:
        await UserModel.updateOne({ _id: userId }, { isPhoneVerified: true });
        break;

      default:
        throw new Error(`Invalid verification type!`);
    }
  }

  @Get("/:type/")
  public request() {
    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.enum(Object.values(VerificationType)),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "usersVerifications.params",
        });

        return Response.data({
          token: await UsersVerificationsController.requestVerification(
            Params.type,
            ctx.router.state.auth.userId
          ),
        });
      },
    });
  }

  @Post("/verify/")
  public verify() {
    // Define Body Schema
    const BodySchema = e.object({
      type: e.enum(Object.values(VerificationType)),
      token: e.string(),
      code: e.number({ cast: true }).length(6),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "usersVerifications.body" }
        );

        const Payload = await OauthController.verifyToken<{
          type: VerificationType;
          userId: string;
        }>({
          type: Body.type + "_verification",
          token: Body.token,
          secret: Body.code + ctx.router.state.auth.userId,
        }).catch(e.error);

        await UsersVerificationsController.verify(Payload.type, Payload.userId);

        return Response.true();
      },
    });
  }
}
