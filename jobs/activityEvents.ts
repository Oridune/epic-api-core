import { RouterContext } from "oak";
import {
  Env,
  EnvType,
  EventChannel,
  Events,
  IRequestContext,
  Response,
} from "@Core/common/mod.ts";
import e from "validator";
import { ObjectId } from "mongo";
import { Novu, PushProviderIdEnum } from "novu";
import { TUserOutput, UserModel } from "@Models/user.ts";
import { OauthSessionModel } from "@Models/oauthSession.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";
import { TFileOutput } from "@Models/file.ts";
import { TTransactionOutput } from "@Models/transaction.ts";
import { Store } from "@Core/common/store.ts";
import { Notify } from "@Lib/notify.ts";
import OauthController from "@Controllers/oauth.ts";

export const isUserVerified = async (input: {
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}) => {
  const Policy = ((await Env.get("VERIFIED_ROLE_POLICY", true)) ?? "")
    .split(/\s*,\s*/g)
    .filter(Boolean);

  let verified = true;

  verified = verified &&
    (!Policy.includes("email") ||
      (Policy.includes("email") && !!input.isEmailVerified));

  verified = verified &&
    (!Policy.includes("phone") ||
      (Policy.includes("phone") && !!input.isPhoneVerified));

  return verified;
};

export const syncUserVerifiedRole = async (
  userId: string,
  options?: {
    verifiedRole?: string;
  },
) => {
  const User = await UserModel.findOne(userId).project({
    role: 1,
    isEmailVerified: 1,
    isPhoneVerified: 1,
  });

  if (!User) {
    throw new Error(
      `A user who just updated his email or phone, was not found!`,
    );
  }

  const Verified = await isUserVerified(User);

  const Role = Verified ? options?.verifiedRole ?? "user" : "unverified";

  if (User.role !== Role) await UserModel.updateOne(User._id, { role: Role });

  return {
    verified: Verified,
    role: Role,
  };
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
    try {
      if (Env.is(EnvType.TEST)) return;

      const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

      const Body = event.detail.res.getBody();

      if (Body.status && Body.data) {
        await Notifier.subscribers.identify(Body.data._id.toString(), {
          avatar: Body.data.avatar?.url,
          firstName: Body.data.fname,
          lastName: Body.data.lname,
          locale: Body.data.locale,
          email: Body.data.email,
          phone: Body.data.phone,
        });
      }
    } catch {
      // Do nothing...
    }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<ReturnType<typeof OauthController.createOauthAccessTokens>>;
  }>(
    EventChannel.REQUEST,
    ["oauth.exchangeCode", "users.setFcmToken", "users.deleteFcmToken"],
    async (event) => {
      const Request = event.detail.ctx;

      if (Request.router.state.updateFcmDeviceTokens) {
        const User = await UserModel.findOne(
          Request.router.state.updateFcmDeviceTokens,
        ).project({ _id: 1, fcmDeviceTokens: 1 });

        if (User) {
          const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

          await Notifier.subscribers.setCredentials(
            User._id.toString(),
            PushProviderIdEnum.FCM,
            { deviceTokens: User.fcmDeviceTokens },
          );
        }
      }
    },
  );

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<ReturnType<typeof OauthController.createOauthAccessTokens>>;
  }>(
    EventChannel.REQUEST,
    "oauth.logout",
    async (event) => {
      const { ctx } = event.detail;

      if (ctx.router.state.updateFcmDeviceTokens) {
        const User = await UserModel.findOne(
          ctx.router.state.updateFcmDeviceTokens,
        ).project({ _id: 1, fcmDeviceTokens: 1 });

        if (User) {
          const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

          await Notifier.subscribers.setCredentials(
            User._id.toString(),
            PushProviderIdEnum.FCM,
            { deviceTokens: User.fcmDeviceTokens },
          );
        }
      }

      // Invalidate Cached Session
      await Store.del(
        `checkPermissions:${
          ctx.router.state.sessionInfo?.claims.sessionId ??
            ctx.router.state.sessionInfo?.claims.secretId
        }:${ctx.router.state.auth?.accountId}`,
      );
    },
  );

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
      try {
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
                Notifier.subscribers.identify(
                  Request.router.state.auth!.userId,
                  {
                    [Body.data!.type]: Body.data!.value,
                  },
                )
              );
          }
        }
      } catch {
        // Do nothing...
      }
    },
  );

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.verify", async (event) => {
    try {
      const { ctx, res } = event.detail;

      const Body = res.getBody();

      if (Body.status) {
        const VerifyTokenPayload = await e
          .object(
            {
              method: e.string(),
              userId: e.string(),
            },
            { allowUnexpectedProps: true },
          )
          .validate(ctx.router.state.verifyTokenPayload);

        await syncUserVerifiedRole(VerifyTokenPayload.userId);

        // Invalidate Cached Session
        await Store.del(
          `checkPermissions:${
            ctx.router.state.sessionInfo?.claims.sessionId ??
              ctx.router.state.sessionInfo?.claims.secretId
          }:${ctx.router.state.auth?.accountId}`,
        );
      }
    } catch {
      // Do nothing...
    }
  });

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
    try {
      const Request = event.detail.ctx;
      const Body = event.detail.res.getBody();

      if (typeof Request.router.state.auth?.userId === "string") {
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
                Payload,
              )
            );
        }
      }
    } catch {
      // Do nothing...
    }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response<TFileOutput>;
  }>(EventChannel.REQUEST, "users.updateAvatar", async (event) => {
    try {
      const Request = event.detail.ctx;
      const Body = event.detail.res.getBody();

      if (
        Body.status && typeof Request.router.state.auth?.userId === "string"
      ) {
        const Notifier = new Novu(await Env.get("NOVU_API_KEY"));

        switch (Request.router.request.method.toLowerCase()) {
          case "put":
            if (Body.data) {
              const Payload = {
                avatar: Body.data.url,
              };

              await Notifier.subscribers
                .update(Request.router.state.auth.userId, Payload)
                .catch(() =>
                  Notifier.subscribers.identify(
                    Request.router.state.auth!.userId,
                    Payload,
                  )
                );
            }
            break;

          case "delete":
            //! Need to delete avatar from Novu!
            break;

          default:
            break;
        }
      }
    } catch {
      // Do nothing...
    }
  });

  Events.listen<{
    ctx: IRequestContext<RouterContext<string>>;
    res: Response;
  }>(EventChannel.REQUEST, "users.updatePassword", async (event) => {
    try {
      const Request = event.detail.ctx;
      const Body = event.detail.res.getBody();

      if (Body.status) {
        const VerifyTokenPayload = await e
          .object(
            {
              method: e.string(),
              userId: e.string(),
            },
            { allowUnexpectedProps: true },
          )
          .validate(Request.router.state.verifyTokenPayload);

        await OauthSessionModel.deleteMany({
          createdBy: new ObjectId(VerifyTokenPayload.userId),
        });
      }
    } catch {
      // Do nothing...
    }
  });

  if (Env.enabledSync("WALLET_TRANSFER_NOTIFICATION_TRIGGER_MANUALLY")) {
    Events.listen<{
      ctx: IRequestContext<RouterContext<string>>;
      res: Response<{ transaction: TTransactionOutput }>;
    }>(
      EventChannel.REQUEST,
      "wallet.transfer",
      async (event) => {
        try {
          const Body = event.detail.res.getBody();
          const Transaction = Body.data?.transaction;

          if (Transaction) {
            await Notify.sendWithNovu({
              template: `wallet-transfer`,
              subscriberId: Transaction.receiver.toString(),
              payload: {
                txnId: Transaction._id.toString(),
                reference: Transaction.reference,
                type: Transaction.type,
                currency: Transaction.currency,
                amount: Transaction.amount,
                fromName: Transaction.fromName,
                account: Transaction.to.toString(),
              },
            });
          }
        } catch {
          // Do nothing...
        }
      },
    );
  } else {
    Events.listen<{ transaction: TTransactionOutput }>(
      EventChannel.CUSTOM,
      "wallet.transfer",
      async (event) => {
        try {
          const Transaction = event.detail.transaction;

          await Notify.sendWithNovu({
            template: `wallet-transfer`,
            subscriberId: Transaction.receiver.toString(),
            payload: {
              txnId: Transaction._id.toString(),
              reference: Transaction.reference,
              type: Transaction.type,
              currency: Transaction.currency,
              amount: Transaction.amount,
              fromName: Transaction.fromName,
              account: Transaction.to.toString(),
            },
          });
        } catch {
          // Do nothing...
        }
      },
    );
  }
};
