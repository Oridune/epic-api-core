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
import { ObjectId } from "mongo";
import { Novu } from "novu";
import { TUserOutput, UserModel } from "@Models/user.ts";
import { OauthSessionModel } from "@Models/oauth-session.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { TFileOutput } from "@Models/file.ts";

export const isUserVerified = async (input: {
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}) => {
  const Policy = ((await Env.get("VERIFIED_ROLE_POLICY", true)) ?? "")
    .split(/\s*,\s*/g)
    .filter(Boolean);

  let verified = true;

  verified =
    verified &&
    (!Policy.includes("email") ||
      (Policy.includes("email") && !!input.isEmailVerified));

  verified =
    verified &&
    (!Policy.includes("phone") ||
      (Policy.includes("phone") && !!input.isPhoneVerified));

  return verified;
};

export const syncUserVerifiedRole = async (
  userId: string,
  options?: {
    verifiedRole?: string;
  }
) => {
  const User = await UserModel.findOne(userId)
    .populate("collaborates", CollaboratorModel, { project: { role: 1 } })
    .project({
      isEmailVerified: 1,
      isPhoneVerified: 1,
      collaborates: 1,
    });

  if (!User)
    throw new Error(
      `A user who just updated his email or phone, was not found!`
    );

  if (!User.collaborates.length)
    throw new Error("A user exists but is not collaborating on any account!");

  const Verified = await isUserVerified(User);

  const Collaborator = User.collaborates.find(
    (collaborator) => collaborator.isOwned && collaborator.isPrimary
  );

  if (Collaborator) {
    const Role = Verified ? options?.verifiedRole ?? "user" : "unverified";

    if (Collaborator.role !== Role)
      await CollaboratorModel.updateOne(
        { _id: Collaborator._id },
        { role: Role }
      );
  }

  return Verified;
};

export default () => {
  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<
      Omit<
        TUserOutput,
        "password" | "passwordHistory" | "oauthApp" | "collaborates"
      >
    >;
  }>(EventChannel.REQUEST, "users.create", async (event) => {
    if (Env.is(EnvType.TEST)) return;

    const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

    const Body = event.detail.res.getBody();

    if (Body.status && Body.data)
      await Notifier.subscribers.identify(Body.data._id.toString(), {
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

      await syncUserVerifiedRole(VerifyTokenPayload.userId);
    }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<{
      type: IdentificationMethod;
      value: string;
      verified: boolean;
    }>;
  }>(
    EventChannel.REQUEST,
    ["users.updateEmail", "users.updatePhone"],
    async (event) => {
      const Request = event.detail.ctx;

      if (typeof Request.router.state.auth?.userId === "string") {
        await syncUserVerifiedRole(Request.router.state.auth.userId);

        const Body = event.detail.res.getBody();

        if (Body.status && Body.data) {
          const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

          await Notifier.subscribers
            .update(Request.router.state.auth.userId, {
              [Body.data.type]: Body.data.value,
            })
            .catch(() =>
              Notifier.subscribers.identify(Request.router.state.auth!.userId, {
                [Body.data!.type]: Body.data!.value,
              })
            );
        }
      }
    }
  );

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<
      Partial<
        Omit<
          TUserOutput,
          | "email"
          | "isEmailVerified"
          | "phone"
          | "isPhoneVerified"
          | "password"
          | "passwordHistory"
          | "oauthApp"
          | "collaborates"
        >
      >
    >;
  }>(EventChannel.REQUEST, "users.update", async (event) => {
    const Request = event.detail.ctx;
    const Body = event.detail.res.getBody();

    if (typeof Request.router.state.auth?.userId === "string")
      if (Body.status && Body.data) {
        const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

        const Payload = {
          firstName: Body.data.fname,
          lastName: Body.data.lname,
          locale: Body.data.locale,
        };

        await Notifier.subscribers
          .update(Request.router.state.auth.userId, Payload)
          .catch(() =>
            Notifier.subscribers.identify(
              Request.router.state.auth!.userId,
              Payload
            )
          );
      }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<TFileOutput>;
  }>(EventChannel.REQUEST, "users.updateAvatar", async (event) => {
    const Request = event.detail.ctx;
    const Body = event.detail.res.getBody();

    if (typeof Request.router.state.auth?.userId === "string")
      if (Body.status && Body.data) {
        const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

        const Payload = {
          avatar: Body.data.url,
        };

        await Notifier.subscribers
          .update(Request.router.state.auth.userId, Payload)
          .catch(() =>
            Notifier.subscribers.identify(
              Request.router.state.auth!.userId,
              Payload
            )
          );
      }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.updatePassword", async (event) => {
    const Request = event.detail.ctx;
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
        .validate(Request.router.state.verifyTokenPayload);

      await OauthSessionModel.deleteMany({
        createdBy: new ObjectId(VerifyTokenPayload.userId),
      });
    }
  });
};
