import { RouterContext } from "oak";
import { Env, IRequestContext, Response } from "@Core/common/mod.ts";
import { Novu } from "novu";
import { UserModel } from "@Models/user.ts";

export default () => {
  addEventListener("oauth.authenticate", (e) => {
    const Evt = e as CustomEvent<{
      ctx: IRequestContext<RouterContext<string>>;
      res: Response;
    }>;

    console.log(
      "Authenticated!",
      Evt.detail.res,
      Evt.detail.ctx.router.request.headers.get("user-agent")
    );
  });

  addEventListener("users.create", async (e) => {
    const Evt = e as CustomEvent<{
      ctx: IRequestContext<RouterContext<string>>;
      res: Response;
    }>;

    const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

    const Data = Evt.detail.res.getBody();

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

  addEventListener("usersVerifications.verify", async (e) => {
    const Evt = e as CustomEvent<{
      ctx: IRequestContext<RouterContext<string>>;
      res: Response;
    }>;

    const Data = Evt.detail.res.getBody();

    if (Data.status) {
      const User = await UserModel.findOne(
        { _id: Evt.detail.ctx.router.state.auth!.userId },
        {
          isEmailVerified: 1,
          isPhoneVerified: 1,
          collaborates: 1,
        }
      ).populate(["collaborates"]);

      if (User) {
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
      }
    }
  });
};
