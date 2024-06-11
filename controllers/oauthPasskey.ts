import {
  BaseController,
  Controller,
  Env,
  Get,
  type IRequestContext,
  type IRoute,
  Post,
  Response,
  Store,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "simplewebauthn";

import verifyHuman from "@Middlewares/verifyHuman.ts";
import { UserModel, UsernameValidator } from "@Models/user.ts";
import OauthController, { AuthenticationSchema } from "@Controllers/oauth.ts";
import { OauthProvider } from "@Models/oauthSession.ts";

@Controller("/oauth/passkey/", { name: "oauthPasskey" })
export default class OauthPasskeyController extends BaseController {
  @Get("/challenge/", {
    middlewares: () => [verifyHuman()],
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public challenge(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object({
      register: e.boolean({ cast: true }),
      username: UsernameValidator(),
    }, { allowUnexpectedProps: true });

    return new Versioned().add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` },
        );

        const Referer = new URL(
          ctx.router.request.headers.get("referer") ?? "localhost",
        );

        const Challenge = Query.register
          ? await generateRegistrationOptions({
            rpName: await Env.get("DISPLAY_NAME"),
            rpID: Referer.hostname,
            userName: Query.username,
            attestationType: "none",
          })
          : await generateAuthenticationOptions({
            rpID: Referer.hostname,
            allowCredentials: await (async () => {
              const { passkey } = await UserModel.findOneOrFail({
                username: Query.username,
              })
                .project({ passkey: 1 });

              return [{
                id: passkey.id,
                transports: passkey.transports,
              }];
            })(),
          });

        await Store.set(
          [
            "passkeyChallenge",
            Query.register ? "register" : "login",
            Query.username,
          ].join(":"),
          Challenge,
          {
            expiresInMs: 1000 * 60 * 10, // 10 minutes
          },
        );

        return Response.data({ challenge: Challenge });
      },
    });
  }

  @Post("/challenge/verify/", {
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public verifyChallenge(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      credentials: e.object({
        id: e.string(),
        rawId: e.string(),
        response: e.any(),
        authenticatorAttachment: e.optional(
          e.enum(["cross-platform", "platform"] as const),
        ),
        clientExtensionResults: e.any(),
        type: e.enum(["public-key"] as const),
      }),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        if (ctx.router.state.auth.user.passkeyEnabled) {
          throw e.error("Passkey is already enabled!");
        }

        const ChallengeKey = [
          "passkeyChallenge",
          "register",
          ctx.router.state.auth.user.username,
        ].join(":");

        const Challenge = await Store.get<
          Awaited<ReturnType<typeof generateRegistrationOptions>>
        >(
          ChallengeKey,
        );

        if (!Challenge) {
          throw e.error("You didn't initiate a challenge or it is expired!");
        }

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        const Referer = new URL(
          ctx.router.request.headers.get("referer") ?? "localhost",
        );

        const { verified, registrationInfo } = await verifyRegistrationResponse(
          {
            expectedChallenge: Challenge.challenge,
            expectedOrigin: Referer.origin,
            expectedRPID: Referer.hostname,
            response: Body.credentials,
          },
        );

        if (!verified) {
          throw e.error("Passkey credentials verification has failed!");
        }

        await UserModel.updateOneOrFail({
          _id: new ObjectId(ctx.router.state.auth.userId),
          passkeyEnabled: {
            $ne: true,
          },
        }, {
          passkey: {
            id: registrationInfo?.credentialID,
            webAuthnUserID: Challenge.user.id,
            publicKey: registrationInfo?.credentialPublicKey,
            counter: registrationInfo?.counter,
            deviceType: registrationInfo?.credentialDeviceType,
            backedUp: registrationInfo?.credentialBackedUp,
            transports: Body.credentials.response.transports,
          },
          passkeyEnabled: true,
        }).catch(() => {
          throw e.error("A passkey is already configured!");
        });

        await Store.del(ChallengeKey).catch(console.error);

        return Response.true();
      },
    });
  }

  @Post("/login/", {
    middlewares: () => [verifyHuman()],
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public login(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      username: UsernameValidator(),
      credentials: e.object({
        id: e.string(),
        rawId: e.string(),
        response: e.any(),
        authenticatorAttachment: e.optional(
          e.enum(["cross-platform", "platform"] as const),
        ),
        clientExtensionResults: e.any(),
        type: e.enum(["public-key"] as const),
      }),
    }).extends(AuthenticationSchema);

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        const ChallengeKey = [
          "passkeyChallenge",
          "login",
          Body.username,
        ].join(":");

        const Challenge = await Store.get<
          Awaited<ReturnType<typeof generateAuthenticationOptions>>
        >(ChallengeKey);

        if (!Challenge) {
          throw e.error("You didn't initiate a challenge or it is expired!");
        }

        const User = await UserModel.findOne(
          (await Env.enabled("ALLOW_CROSS_APP_AUTH"))
            ? {
              username: Body.username,
              passkeyEnabled: true,
            }
            : {
              oauthApp: new ObjectId(Body.oauthAppId),
              username: Body.username,
              passkeyEnabled: true,
            },
        ).project({
          _id: 1,
          username: 1,
          passkey: 1,
          failedLoginAttempts: 1,
          isBlocked: 1,
        });

        login: if (User) {
          if (User.isBlocked) {
            return Response.status(false).message(
              "You have been blocked! Please reset your password.",
            );
          }

          if (
            !User.passkey ||
            User.failedLoginAttempts >
              parseInt(await Env.get("OAUTH_FAILED_LOGIN_LIMIT") ?? "5")
          ) break login;

          const Referer = new URL(
            ctx.router.request.headers.get("referer") ?? "localhost",
          );

          const { verified } = await verifyAuthenticationResponse({
            expectedChallenge: Challenge.challenge,
            expectedOrigin: Referer.origin,
            expectedRPID: Referer.hostname,
            response: Body.credentials,
            authenticator: {
              credentialID: User.passkey.id,
              credentialPublicKey: User.passkey.publicKey,
              counter: User.passkey.counter,
              transports: User.passkey.transports,
            },
          });

          if (!verified) break login;

          // Update User
          await UserModel.updateOne(User._id, {
            $inc: { loginCount: 1 },
            failedLoginAttempts: 0,
            deletionAt: null,
          });

          await Store.del(ChallengeKey).catch(console.error);

          return Response.data({
            ...(await OauthController.createOauthAuthentication({
              provider: OauthProvider.PASSKEY,
              sessionId: new ObjectId(),
              userId: User._id,
              oauthAppId: Body.oauthApp._id,
              codeChallenge: Body.codeChallenge,
              codeChallengeMethod: Body.codeChallengeMethod,
              remember: Body.remember,
            })),
            availableScopes: await OauthController.getAvailableScopes(User._id),
          });
        }

        await Store.del(ChallengeKey).catch(console.error);

        await UserModel.updateOne(
          { username: Body.username },
          { $inc: { failedLoginAttempts: 1 } },
        );

        throw e.error("Invalid credentials provided!");
      },
    });
  }
}
