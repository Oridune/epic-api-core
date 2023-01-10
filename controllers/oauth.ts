import { basename } from "path";
import {
  Controller,
  BaseController,
  Response,
  type IRequestContext,
  Post,
  Env,
} from "@Core/common/mod.ts";
import Manager from "@Core/common/manager.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";
import { SignJWT, jwtVerify, JWTVerifyOptions } from "jose";
import { createHash } from "hash";
import { IUser, UserModel } from "@Models/user.ts";
import { OauthProvider, OauthSessionModel } from "@Models/oauth-session.ts";
import { IOauthApp, OauthAppModel } from "../models/oauth-app.ts";

export enum OauthTokenType {
  CODE = "oauth_code",
  REFRESH = "oauth_refresh_token",
  ACCESS = "oauth_access_token",
}

export enum OauthPKCEMethod {
  SHA256 = "sha256",
}

export interface IOauthVerifyOptions {
  type: OauthTokenType;
  token: string;
  verifyOpts?: JWTVerifyOptions;
}

export interface IOauthToken {
  issuer: string;
  type: OauthTokenType;
  token: string;
  expiresAtSeconds: number;
}

export interface IOauthAccessTokens {
  refresh?: IOauthToken;
  access: IOauthToken;
}

@Controller("/oauth/", {
  /** Do not edit this code */
  childs: await Manager.getModules("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class OauthController extends BaseController {
  static DefaultOauthIssuer = Env.get("DISPLAY_NAME");
  static DefaultOauthAudience = Env.get("DISPLAY_NAME");

  static DefaultRefreshTokenExpirySeconds = 86400;
  static DefaultAccessTokenExpirySeconds = 300;
  static DefaultOauthCodeExpirySeconds = 300;
  static DefaultOauthSessionExpirySeconds = 300;

  static async createOauthToken(opts: {
    type: OauthTokenType;
    payload: Record<string, string | string[] | number | boolean | null>;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }): Promise<IOauthToken> {
    const JWTSecret = new TextEncoder().encode(Env.get("ENCRYPTION_KEY"));
    const Issuer = opts.issuer ?? OauthController.DefaultOauthIssuer;
    const Audience = opts.audience ?? OauthController.DefaultOauthAudience;

    const CurrentDate = Date.now();
    const ExpiresAtSeconds = parseInt(
      (
        CurrentDate / 1000 +
        (opts.expiresInSeconds ?? OauthController.DefaultOauthCodeExpirySeconds)
      ).toString()
    );

    return {
      issuer: Issuer,
      type: opts.type,
      token: await new SignJWT(opts.payload)
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(opts.type)
        .setIssuer(Issuer)
        .setAudience(Audience)
        .setIssuedAt()
        .setExpirationTime(ExpiresAtSeconds)
        .sign(JWTSecret),
      expiresAtSeconds: ExpiresAtSeconds,
    };
  }

  static async createOauthAccessTokens(opts: {
    version: number;
    sessionId: string;
    payload?: Record<string, string | string[] | number | boolean | null>;
    refreshable?: boolean;
    issuer?: string;
    audience?: string;
    refreshTokenExpiresInSeconds?: number;
    accessTokenExpiresInSeconds?: number;
  }): Promise<IOauthAccessTokens> {
    const Payload = {
      version: opts.version,
      sessionId: opts.sessionId,
    };

    return {
      refresh: opts.refreshable
        ? await OauthController.createOauthToken({
            type: OauthTokenType.REFRESH,
            payload: { ...opts.payload, ...Payload },
            issuer: opts.issuer,
            audience: opts.audience,
            expiresInSeconds:
              opts.refreshTokenExpiresInSeconds ??
              OauthController.DefaultRefreshTokenExpirySeconds,
          })
        : undefined,
      access: await OauthController.createOauthToken({
        type: OauthTokenType.ACCESS,
        payload: { ...opts.payload, ...Payload },
        expiresInSeconds:
          opts.accessTokenExpiresInSeconds ??
          OauthController.DefaultAccessTokenExpirySeconds,
      }),
    };
  }

  static async verifyOauthToken(opts: IOauthVerifyOptions) {
    const JWTSecret = new TextEncoder().encode(Env.get("ENCRYPTION_KEY"));
    const JWTResults = await jwtVerify(opts.token, JWTSecret, {
      subject: opts.type,
      issuer: OauthController.DefaultOauthIssuer,
      audience: OauthController.DefaultOauthAudience,
      ...opts.verifyOpts,
    });

    return JWTResults.payload;
  }

  static async createSession(opts: {
    provider: OauthProvider;
    user: IUser;
    app: IOauthApp;
    useragent: string;
    scope?: string[];
    expiresInSeconds?: number;
  }) {
    const Session = new OauthSessionModel({
      createdBy: opts.user,
      provider: opts.provider,
      useragent: opts.useragent,
      app: opts.app,
      version: 0,
      scope: opts.scope,
      expiresAt: new Date(
        Date.now() +
          (opts.expiresInSeconds ??
            OauthController.DefaultRefreshTokenExpirySeconds) *
            1000
      ),
    });

    await Session.save();

    return Session;
  }

  static async refreshSession(opts: {
    sessionId: string;
    expiresInSeconds?: number;
  }) {
    const Session = await OauthSessionModel.findOne({
      _id: opts.sessionId,
    });

    if (!Session) throw new Error("An active session was not found!");

    Session.version += 1;

    Session.expiresAt = new Date(
      Date.now() +
        (opts.expiresInSeconds ??
          OauthController.DefaultRefreshTokenExpirySeconds) *
          1000
    );

    await Session.save();

    return Session;
  }

  static async verifySession(opts: {
    token: string;
    useragent: string;
    verifyOpts?: JWTVerifyOptions;
  }) {
    const Claims = await OauthController.verifyOauthToken({
      type: OauthTokenType.REFRESH,
      token: opts.token,
      verifyOpts: opts.verifyOpts,
    });

    const Session = await OauthSessionModel.findOne({
      _id: Claims.sessionId,
    });

    if (!Session) throw new Error(`An active session was not found!`);

    // if (Session.useragent !== opts.useragent)
    //   throw new Error(`Your session is invalid!`);

    if (Session.version !== Claims.version) {
      await Session.delete();
      throw new Error(`Your session has been expired!`);
    }

    return Claims;
  }

  static async createOauthCode(opts: {
    sessionId: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    remember?: boolean;
    payload?: Record<string, string | string[] | number | boolean | null>;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }) {
    const Payload = {
      sessionId: opts.sessionId,
      codeChallenge: opts.codeChallenge ?? null,
      codeChallengeMethod: opts.codeChallenge
        ? opts.codeChallengeMethod ?? OauthPKCEMethod.SHA256
        : null,
      remember: opts.remember ?? false,
    };

    return {
      oauthCode: await OauthController.createOauthToken({
        type: OauthTokenType.CODE,
        payload: { ...opts.payload, ...Payload },
        issuer: opts.issuer,
        audience: opts.audience,
        expiresInSeconds:
          opts.expiresInSeconds ??
          OauthController.DefaultOauthCodeExpirySeconds,
      }),
    };
  }

  static verifyCodeChallenge(opts: {
    alg: OauthPKCEMethod;
    challenge: string;
    verifier: string;
  }) {
    return (
      createHash(opts.alg)
        .update(opts.verifier)
        .toString("base64")
        .split("=")[0]
        .replaceAll("+", "-")
        .replaceAll("/", "_") ===
      opts.challenge.split("=")[0].replaceAll("+", "-").replaceAll("/", "_")
    );
  }

  @Post("/local/")
  async LocalOauthCode(ctx: IRequestContext<RouterContext<string>>) {
    // Authorization Validation
    const Credentials = await e
      .object({
        username: e.string(),
        password: e.string(),
      })
      .validate(ctx.router.state.credentials, {
        name: "oauth.credentials",
      });

    // Body Validation
    const Body = await e
      .object({
        oauthAppId: e.string().throwsFatal(),
        oauthApp: e.any().custom(async (ctx) => {
          const App = await OauthAppModel.findOne(
            { _id: ctx.parent!.output.oauthAppId },
            { _id: 1 }
          );

          if (!App) throw new Error("Invalid oauth app id!");
          return App;
        }),
        codeChallenge: e.optional(e.string().length({ min: 1, max: 500 })),
        codeChallengeMethod: e.optional(e.in(Object.values(OauthPKCEMethod))),
        remember: e.optional(e.boolean({ cast: true })).default(false),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "oauth.body",
      });

    const User = await UserModel.findOne(
      { username: Credentials.username },
      {
        _id: 1,
        username: 1,
        password: 1,
        failedLoginAttempts: 1,
        loginCount: 1,
        isBlocked: 1,
      }
    );

    login: if (User) {
      if (User.isBlocked)
        return Response.status(false).message("You have been blocked!");

      if (
        User.failedLoginAttempts > 5 ||
        !(await bcrypt.compare(
          Credentials.username + Credentials.password,
          User.password
        ))
      )
        break login;

      User.failedLoginAttempts = 0;
      User.loginCount += 1;

      await User.save();

      // Create New Session
      const Session = await OauthController.createSession({
        provider: OauthProvider.LOCAL,
        user: User,
        app: Body.oauthApp,
        useragent: ctx.router.request.headers.get("User-Agent") ?? "",
      });

      return Response.data(
        await OauthController.createOauthCode({
          sessionId: Session._id.toString(),
          codeChallenge: Body.codeChallenge,
          codeChallengeMethod: Body.codeChallengeMethod,
          remember: Body.remember,
        })
      ).statusCode(Status.Created);
    }

    await UserModel.updateOne(
      { username: Credentials.username },
      { $inc: { failedLoginAttempts: 1 } }
    );

    e.error("Invalid username or password!");
  }

  @Post("/access/")
  async GetAccess(ctx: IRequestContext<RouterContext<string>>) {
    // Body Validation
    const Body = await e
      .object({
        code: e.string().throwsFatal(),
        codePayload: e
          .any()
          .custom((ctx) =>
            OauthController.verifyOauthToken({
              type: OauthTokenType.CODE,
              token: ctx.parent!.output.code,
            })
          )
          .throwsFatal(),
        codeVerifier: e
          .optional(e.string().length({ min: 1, max: 500 }))
          .custom((ctx) => {
            if (ctx.parent?.output.codePayload.codeChallenge && !ctx.output)
              throw "A code verifier is required!";
          }),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "oauth.body",
      });

    // Code Verification
    if (
      Body.codeVerifier &&
      !OauthController.verifyCodeChallenge({
        alg: Body.codePayload.codeChallengeMethod as OauthPKCEMethod,
        challenge: Body.codePayload.codeChallenge as string,
        verifier: Body.codeVerifier,
      })
    )
      e.error("Invalid code verifier!");

    // Refresh Session
    const Session = await OauthController.refreshSession({
      sessionId: Body.codePayload.sessionId as string,
    });

    if (Session.version > 1) e.error("Oauth code has been expired!");

    return Response.data(
      await OauthController.createOauthAccessTokens({
        sessionId: Session._id.toString(),
        version: Session.version,
        refreshable: !!Body.codePayload.remember,
      })
    );
  }

  @Post("/refresh/")
  async RefreshOauth(ctx: IRequestContext<RouterContext<string>>) {
    // Body Validation
    const Body = await e
      .object({
        refreshToken: e.string().throwsFatal(),
        refreshTokenPayload: e.any().custom((_ctx) =>
          OauthController.verifySession({
            token: _ctx.parent!.output.refreshToken,
            useragent: ctx.router.request.headers.get("User-Agent") ?? "",
          })
        ),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "oauth.body",
      });

    // Refresh Session
    const Session = await OauthController.refreshSession({
      sessionId: Body.refreshTokenPayload.sessionId as string,
    });

    return Response.data(
      await OauthController.createOauthAccessTokens({
        sessionId: Session._id.toString(),
        version: Session.version,
        refreshable: true,
      })
    );
  }
}
