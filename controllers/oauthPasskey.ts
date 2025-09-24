// deno-lint-ignore-file no-explicit-any
import {
  BaseController,
  Controller,
  Env,
  Get,
  type IRequestContext,
  type IRoute,
  parseQueryParams,
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
import { isoBase64URL } from "simplewebauthn/helpers";

import verifyHuman from "@Middlewares/verifyHuman.ts";
import { UserModel, UsernameValidator } from "@Models/user.ts";
import OauthController, { AuthenticationSchema } from "@Controllers/oauth.ts";
import { OauthProvider } from "@Models/oauthSession.ts";

@Controller("/oauth/passkey/", { group: "Oauth", name: "oauthPasskey" })
export default class OauthPasskeyController extends BaseController {
  @Get("/challenge/register/", {
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public challengeRegister(_: IRoute) {
    return new Versioned().add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        const Auth = ctx.router.state.auth;

        if (!Auth) ctx.router.throw(Status.Unauthorized);

        const Referer = new URL(
          ctx.router.request.headers.get("referer") ?? "localhost",
        );

        const Challenge = await generateRegistrationOptions({
          rpName: await Env.get("DISPLAY_NAME"),
          rpID: Referer.hostname,
          userID: new TextEncoder().encode(Auth.userId),
          userName: Auth.user.username,
          userDisplayName: [Auth.user.fname, Auth.user.mname, Auth.user.lname]
            .filter(Boolean).join(" "),
          attestationType: "none",
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
          },
          excludeCredentials: Auth.user.passkeys?.map((passkey) => ({
            id: passkey.id,
            transports: passkey.transports as any,
          })) ?? [],
        });

        await Store.set(
          [
            "passkeyChallenge",
            "register",
            Auth.user.username,
          ].join(":"),
          Challenge.challenge,
          {
            expiresInMs: 1000 * 60 * 10, // 10 minutes
          },
        );

        return Response.data({ challenge: Challenge });
      },
    });
  }

  @Post("/register/", {
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public register(route: IRoute) {
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
      shape: () => ({
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        const Auth = ctx.router.state.auth;

        if (!Auth) ctx.router.throw(Status.Unauthorized);

        const ChallengeKey = [
          "passkeyChallenge",
          "register",
          Auth.user.username,
        ].join(":");

        const Challenge = await Store.get<string>(ChallengeKey);

        if (!Challenge) {
          throw e.error("You didn't initiate a challenge or it is expired!");
        }

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const Referer = new URL(
          ctx.router.request.headers.get("referer") ?? "localhost",
        );

        const { verified, registrationInfo } = await verifyRegistrationResponse(
          {
            expectedChallenge: Challenge,
            expectedOrigin: Referer.origin,
            expectedRPID: Referer.hostname,
            response: Body.credentials,
            requireUserVerification: false,
          },
        );

        if (!verified || !registrationInfo) {
          throw e.error("Passkey credentials verification has failed!");
        }

        await UserModel.updateOneOrFail({
          _id: new ObjectId(Auth.userId),
          passkeyEnabled: {
            $ne: true,
          },
        }, {
          passkeyEnabled: true,
          $push: {
            passkeys: {
              id: registrationInfo.credential.id,
              publicKey: isoBase64URL.fromBuffer(
                registrationInfo.credential.publicKey,
              ),
              counter: registrationInfo.credential.counter,
              deviceType: registrationInfo.credentialDeviceType,
              backedUp: registrationInfo.credentialBackedUp,
              transports: Body.credentials.response.transports,
            },
          },
        }).catch(() => {
          throw e.error("A passkey is already configured!");
        });

        await Store.del(ChallengeKey).catch(console.error);

        return Response.true();
      },
    });
  }

  @Get("/challenge/login/", {
    middlewares: () => [verifyHuman()],
    disabled: !Env.enabledSync("ENABLE_PASSKEY_AUTH"),
  })
  public challengeLogin(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object({
      username: UsernameValidator(),
    }, { allowUnexpectedProps: true });

    return new Versioned().add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          parseQueryParams(ctx.router.request.url.search),
          { name: `${route.scope}.query` },
        );

        const User = await UserModel.findOne({
          username: Query.username,
          passkeyEnabled: true,
        }).project({ passkeys: 1 });

        const Referer = new URL(
          ctx.router.request.headers.get("referer") ?? "localhost",
        );

        const Challenge = await generateAuthenticationOptions({
          rpID: Referer.hostname,
          allowCredentials: User?.passkeys?.map((passkey) => ({
            id: passkey.id,
            transports: passkey.transports as any,
          })) ?? [],
        });

        await Store.set(
          [
            "passkeyChallenge",
            "login",
            Query.username,
          ].join(":"),
          Challenge.challenge,
          {
            expiresInMs: 1000 * 60 * 10, // 10 minutes
          },
        );

        return Response.data({ challenge: Challenge });
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
      shape: () => ({
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const ChallengeKey = [
          "passkeyChallenge",
          "login",
          Body.username,
        ].join(":");

        const Challenge = await Store.get<string>(ChallengeKey);

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
          passkeys: 1,
          passkeyEnabled: 1,
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
            !User.passkeyEnabled || !(User.passkeys instanceof Array) ||
            User.failedLoginAttempts >
              parseInt(await Env.get("OAUTH_FAILED_LOGIN_LIMIT") ?? "5")
          ) break login;

          const Referer = new URL(
            ctx.router.request.headers.get("referer") ?? "localhost",
          );

          const Passkey = User.passkeys.find((passkey) =>
            passkey.id === Body.credentials.id
          );

          if (!Passkey) break login;

          const { verified } = await verifyAuthenticationResponse({
            response: Body.credentials,
            expectedChallenge: Challenge,
            expectedOrigin: Referer.origin,
            expectedRPID: Referer.hostname,
            credential: {
              id: Passkey.id,
              publicKey: isoBase64URL.toBuffer(
                Passkey.publicKey,
              ),
              counter: Passkey.counter,
              transports: Passkey.transports as any,
            },
            requireUserVerification: false,
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
