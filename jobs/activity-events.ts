import { RouterContext } from "oak";
import {
  Env,
  EnvType,
  Events,
  EventChannel,
  IRequestContext,
  Response,
} from "@Core/common/mod.ts";
import e from "validator";
import { Novu } from "novu";
import { IUser, UserModel } from "@Models/user.ts";
import { OauthSessionModel } from "@Models/oauth-session.ts";

export default () => {
  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<
      Omit<IUser, "password" | "passwordHistory" | "oauthApp" | "collaborates">
    >;
  }>(EventChannel.REQUEST, "users.create", async (event) => {
    if (Env.is(EnvType.TEST)) return;

    const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

    const Body = event.detail.res.getBody();

    if (Body.status && Body.data)
      await Notifier.subscribers.identify(Body.data._id, {
        avatar: Body.data.avatar?.url,
        firstName: Body.data.fname,
        lastName: Body.data.lname,
        locale: Body.data.locale,
        email: Body.data.email,
        phone: Body.data.phone,
      });
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.verify", async (event) => {
    const Body = event.detail.res.getBody();

    if (Body.status) {
      const VerifyTokenPayload = await e
        .object(
          {
            method: e.string(),
            userId: e.string(),
          },
          { allowUnexpectedProps: true }
        )
        .validate(event.detail.ctx.router.state.verifyTokenPayload);

      const User = await UserModel.findOne(
        { _id: VerifyTokenPayload.userId },
        {
          isEmailVerified: 1,
          isPhoneVerified: 1,
          collaborates: 1,
        },
        {
          new: true,
        }
      ).populate(["collaborates"]);

      if (User) {
        if (!User.collaborates.length)
          throw new Error(
            "A user that was verified, exists but is not connected to an account!"
          );

        const Collaborator = User.collaborates.find(
          (collaborator) => collaborator.isOwned && collaborator.isPrimary
        );

        if (Collaborator && Collaborator.role === "unverified") {
          const Policy = ((await Env.get("VERIFIED_ROLE_POLICY", true)) ?? "")
            .split(/\s*,\s*/g)
            .filter(Boolean);

          let verified = true;

          verified =
            verified &&
            (!Policy.includes("email") ||
              (Policy.includes("email") && User.isEmailVerified));

          verified =
            verified &&
            (!Policy.includes("phone") ||
              (Policy.includes("phone") && User.isPhoneVerified));

          if (verified) {
            Collaborator.role = "user";
            await Collaborator.save();
          }
        }
      } else throw new Error(`A user that was just verified, not found!`);
    }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.updatePassword", async (event) => {
    const Body = event.detail.res.getBody();

    if (Body.status) {
      const VerifyTokenPayload = await e
        .object(
          {
            method: e.string(),
            userId: e.string(),
          },
          { allowUnexpectedProps: true }
        )
        .validate(event.detail.ctx.router.state.verifyTokenPayload);

      await OauthSessionModel.deleteMany({
        createdBy: VerifyTokenPayload.userId,
      });
    }
  });
};
