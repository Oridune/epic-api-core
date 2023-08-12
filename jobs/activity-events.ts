import { RouterContext } from "oak";
import {
  Env,
  EnvType,
  Events,
  EventChannel,
  IRequestContext,
  Response,
} from "@Core/common/mod.ts";
import { Novu } from "novu";
import { UserModel } from "@Models/user.ts";
import e from "validator";

export default () => {
  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.create", async (event) => {
    if (Env.is(EnvType.TEST)) return;

    const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

    const Data = event.detail.res.getBody();

    if (Data.status)
      await Notifier.subscribers.identify(Data.data._id, {
        avatar: Data.data.avatar?.url,
        firstName: Data.data.fname,
        lastName: Data.data.lname,
        locale: Data.data.locale,
        email: Data.data.email,
        phone: Data.data.phone,
      });
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.verify", async (event) => {
    const Data = event.detail.res.getBody();

    if (Data.status) {
      const VerificationTokenPayload = await e
        .object(
          {
            method: e.string(),
            userId: e.string(),
          },
          { allowUnexpectedProps: true }
        )
        .validate(event.detail.ctx.router.state.verifyTokenPayload);

      const User = await UserModel.findOne(
        { _id: VerificationTokenPayload.userId },
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
};
