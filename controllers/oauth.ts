// deno-lint-ignore-file no-explicit-any
import {
  BaseController,
  Controller,
  Delete,
  Env,
  EnvType,
  fetch,
  type IRequestContext,
  type IRoute,
  Post,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";
import { JWTPayload, jwtVerify, JWTVerifyOptions, SignJWT } from "jose";
import { createHash } from "hash";
import { ObjectId } from "mongo";
// @deno-types="npm:@types/ua-parser-js"
import { UAParser } from "useragent";

import verifyHuman from "@Middlewares/verifyHuman.ts";
import { UserModel, UsernameValidator } from "@Models/user.ts";
import { OauthProvider, OauthSessionModel } from "@Models/oauthSession.ts";
import { OauthAppModel } from "@Models/oauthApp.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { OauthPolicyModel } from "@Models/oauthPolicy.ts";
import { AccountModel } from "@Models/account.ts";
import { SecurityGuard } from "@Lib/securityGuard.ts";
import { ResolveScopeRole } from "../hooks/checkPermissions.ts";
import { OauthSecretModel } from "@Models/oauthSecret.ts";

export enum OauthTokenType {
  AUTHENTICATION = "oauth_authentication",
  CODE = "oauth_code",
  REFRESH = "oauth_refresh_token",
  ACCESS = "oauth_access_token",
  PERMIT = "oauth_permit",
  SECRET = "oauth_secret",
}

export enum OauthPKCEMethod {
  SHA256 = "sha256",
}

export interface IOauthVerifyOptions {
  type: string;
  token: string;
  secret?: string;
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

export type TokenPayload = {
  [K: string]:
    | string
    | string[]
    | number
    | boolean
    | null
    | undefined
    | TokenPayload;
};

export const DefaultOauthIssuer = Env.getSync("DISPLAY_NAME");
export const DefaultOauthAudience = DefaultOauthIssuer;
export const OauthTokenExpirySecond = parseInt(
  Env.getSync("OAUTH_TOKEN_EXPIRY_SECOND", true) ?? "300", // 5m
);
export const OauthAuthenticationExpirySecond = parseInt(
  Env.getSync(
    "OAUTH_AUTHENTICATION_EXPIRY_SECOND",
    true,
  ) ?? "180", // 3m
);
export const OauthCodeExpirySecond = parseInt(
  Env.getSync(
    "OAUTH_CODE_EXPIRY_SECOND",
    true,
  ) ?? "300", // 5m
);
export const OauthRefreshExpirySecond = parseInt(
  Env.getSync(
    "OAUTH_REFRESH_EXPIRY_SECOND",
    true,
  ) ?? "604800", // 1w
);
export const OauthAccessExpirySecond = parseInt(
  Env.getSync(
    "OAUTH_ACCESS_EXPIRY_SECOND",
    true,
  ) ?? "86400", // 1d
);

@Controller("/oauth/", { group: "Oauth", name: "oauth" })
export default class OauthController extends BaseController {
  static DefaultOauthIssuer = DefaultOauthIssuer;
  static DefaultOauthAudience = DefaultOauthAudience;

  static DefaultOauthAuthenticationExpirySeconds =
    OauthAuthenticationExpirySecond;
  static DefaultOauthCodeExpirySeconds = OauthCodeExpirySecond;
  static DefaultOauthRefreshExpirySeconds = OauthRefreshExpirySecond;
  static DefaultOauthAccessExpirySeconds = OauthAccessExpirySecond;

  static async createToken<T extends string>(opts: {
    type: T;
    payload: TokenPayload;
    secret?: string;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }) {
    const JWTSecret = new TextEncoder().encode(
      (opts.secret ?? "") + (await Env.get("ENCRYPTION_KEY")),
    );
    const Issuer = opts.issuer ?? OauthController.DefaultOauthIssuer;
    const Audience = opts.audience ?? OauthController.DefaultOauthAudience;

    const CurrentDate = Date.now();
    const ExpiresAtSeconds = CurrentDate / 1000 +
      (opts.expiresInSeconds ?? Infinity);

    const Signer = new SignJWT(opts.payload)
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(opts.type)
      .setIssuer(Issuer)
      .setAudience(Audience)
      .setIssuedAt();

    if (ExpiresAtSeconds !== Infinity) {
      Signer.setExpirationTime(ExpiresAtSeconds);
    }

    return {
      issuer: Issuer,
      type: opts.type,
      token: await Signer.sign(JWTSecret),
      expiresAtSeconds: ExpiresAtSeconds,
    };
  }

  static async createOauthToken(opts: {
    type: OauthTokenType;
    payload: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }): Promise<IOauthToken> {
    return await OauthController.createToken(opts);
  }

  static async createOauthAccessTokens(opts: {
    version: number;
    sessionId: ObjectId | string;
    payload?: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    refreshable?: boolean;
    issuer?: string;
    audience?: string;
    refreshTokenExpiresInSeconds?: number;
    accessTokenExpiresInSeconds?: number;
  }): Promise<IOauthAccessTokens> {
    const Payload = {
      version: opts.version,
      sessionId: opts.sessionId.toString(),
      refreshable: !!opts.refreshable,
    };

    return {
      refresh: opts.refreshable
        ? await OauthController.createOauthToken({
          type: OauthTokenType.REFRESH,
          payload: { ...opts.payload, ...Payload },
          issuer: opts.issuer,
          audience: opts.audience,
          expiresInSeconds: opts.refreshTokenExpiresInSeconds ??
            OauthController.DefaultOauthRefreshExpirySeconds,
        })
        : undefined,
      access: await OauthController.createOauthToken({
        type: OauthTokenType.ACCESS,
        payload: { ...opts.payload, ...Payload },
        issuer: opts.issuer,
        audience: opts.audience,
        expiresInSeconds: opts.accessTokenExpiresInSeconds ??
          OauthController.DefaultOauthAccessExpirySeconds *
            (opts.refreshable ? 1 : 12),
      }),
    };
  }

  static async createOauthPermitToken(opts: {
    version: number;
    sessionId: string;
    scopes: string[];
    payload?: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }) {
    const Payload = {
      version: opts.version,
      sessionId: opts.sessionId,
      scopes: opts.scopes,
    };

    return {
      permit: await OauthController.createOauthToken({
        type: OauthTokenType.PERMIT,
        payload: { ...opts.payload, ...Payload },
        issuer: opts.issuer,
        audience: opts.audience,
        expiresInSeconds: opts.expiresInSeconds ??
          OauthController.DefaultOauthAccessExpirySeconds * 2,
      }),
    };
  }

  static async createOauthSecret(opts: {
    userId: ObjectId | string;
    oauthAppId: ObjectId | string;
    name: string;
    scopes: Record<string, string[]>;
    payload?: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    expiresInSeconds?: number;
  }) {
    const Secret = await OauthSecretModel.create({
      createdBy: new ObjectId(opts.userId),
      oauthApp: new ObjectId(opts.oauthAppId),
      name: opts.name,
      scopes: opts.scopes,
      expiresAt: opts.expiresInSeconds
        ? new Date(
          Date.now() + opts.expiresInSeconds * 1000,
        )
        : undefined,
    });

    const Payload = {
      secretId: Secret._id.toString(),
    };

    return {
      secret: await OauthController.createOauthToken({
        type: OauthTokenType.SECRET,
        payload: { ...opts.payload, ...Payload },
        expiresInSeconds: opts.expiresInSeconds,
      }),
    };
  }

  static async verifyToken<P>(opts: IOauthVerifyOptions) {
    const JWTSecret = new TextEncoder().encode(
      (opts.secret ?? "") + (await Env.get("ENCRYPTION_KEY")),
    );

    const JWTResults = await jwtVerify(opts.token, JWTSecret, {
      subject: opts.type,
      issuer: OauthController.DefaultOauthIssuer,
      audience: OauthController.DefaultOauthAudience,
      ...opts.verifyOpts,
    });

    return JWTResults.payload as P & JWTPayload;
  }

  static resolveUserAgent(useragent: string) {
    const ParsedUA = new UAParser(useragent);

    const Device = ParsedUA.getDevice();
    const Browser = ParsedUA.getBrowser();
    const BrowserEngine = ParsedUA.getEngine();
    const OS = ParsedUA.getOS();
    const CPU = ParsedUA.getCPU();

    return [
      Device.type,
      OS.name,
      CPU.architecture,
      Browser.name,
      BrowserEngine.name,
    ].filter(Boolean).join(";");
  }

  static async createSession(opts: {
    provider: OauthProvider;
    sessionId?: ObjectId | string;
    userId: ObjectId | string;
    oauthAppId: ObjectId | string;
    useragent: string;
    scopes: Record<string, string[]>;
    expiresInSeconds?: number;
  }) {
    return await OauthSessionModel.create({
      _id: new ObjectId(opts.sessionId),
      createdBy: new ObjectId(opts.userId),
      provider: opts.provider,
      useragent: OauthController.resolveUserAgent(opts.useragent),
      oauthApp: new ObjectId(opts.oauthAppId),
      version: 0,
      scopes: opts.scopes,
      expiresAt: opts.expiresInSeconds
        ? new Date(
          Date.now() + opts.expiresInSeconds * 1000,
        )
        : undefined,
    });
  }

  static async refreshSession(opts: {
    sessionId: string;
    useragent: string;
    expiresInSeconds?: number;
  }) {
    try {
      await OauthSessionModel.updateOneOrFail(opts.sessionId, {
        $inc: { version: 1 },
        useragent: OauthController.resolveUserAgent(opts.useragent),
        ...(opts.expiresInSeconds
          ? {
            expiresAt: new Date(
              Date.now() + opts.expiresInSeconds * 1000,
            ),
          }
          : {}),
      });

      return await OauthSessionModel.findOneOrFail(opts.sessionId);
    } catch (error) {
      throw new Error("An active session was not found!", { cause: error });
    }
  }

  static async verifySession(opts: {
    type: OauthTokenType;
    token: string;
    useragent: string;
    useragentCheck?: boolean;
    verifyOpts?: JWTVerifyOptions;
  }) {
    const Claims = await OauthController.verifyToken({
      type: opts.type,
      token: opts.token,
      verifyOpts: opts.verifyOpts,
    });

    if (typeof Claims.sessionId !== "string") {
      throw new Error(`No session id claim!`);
    }

    const Session = await OauthSessionModel.findOne(Claims.sessionId);

    if (!Session) throw new Error(`We didn't found an active session!`);

    if (
      opts.useragentCheck !== false ||
      await Env.get("ENABLE_USERAGENT_CHECK", true) !== "0"
    ) {
      const UserAgent = OauthController.resolveUserAgent(opts.useragent);

      if (Session.useragent !== UserAgent) {
        throw new Error(`Your session is invalid!`, {
          cause: {
            message: "User-Agent didn't match!",
            gotUserAgent: Session.useragent,
            expectedUserAgent: UserAgent,
          },
        });
      }
    }

    if (Session.version !== Claims.version) {
      await OauthSessionModel.deleteOne(Session._id);
      throw new Error(`Your session has been expired!`);
    }

    return {
      claims: Claims,
      session: Session,
    };
  }

  static async verifySecret(opts: {
    token: string;
    verifyOpts?: JWTVerifyOptions;
  }) {
    const Claims = await OauthController.verifyToken({
      type: OauthTokenType.SECRET,
      token: opts.token,
      verifyOpts: opts.verifyOpts,
    });

    if (typeof Claims.secretId !== "string") {
      throw new Error(`No secret id claim!`);
    }

    const Secret = await OauthSecretModel.findOne(Claims.secretId);

    if (!Secret) throw new Error(`We didn't found that secret!`);

    return {
      claims: Claims,
      secret: Secret,
    };
  }

  static async createOauthAuthentication(opts: {
    provider: OauthProvider;
    sessionId: ObjectId | string;
    userId: ObjectId | string;
    oauthAppId: ObjectId | string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    remember?: boolean;
    payload?: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }) {
    const Payload = {
      provider: opts.provider,
      sessionId: opts.sessionId.toString(),
      userId: opts.userId.toString(),
      oauthAppId: opts.oauthAppId.toString(),
      codeChallenge: opts.codeChallenge ?? null,
      codeChallengeMethod: opts.codeChallenge
        ? opts.codeChallengeMethod ?? OauthPKCEMethod.SHA256
        : null,
      remember: opts.remember ?? false,
    };

    return {
      authenticationToken: await OauthController.createOauthToken({
        type: OauthTokenType.AUTHENTICATION,
        payload: { ...opts.payload, ...Payload },
        issuer: opts.issuer,
        audience: opts.audience,
        expiresInSeconds: opts.expiresInSeconds ??
          OauthController.DefaultOauthAuthenticationExpirySeconds,
      }),
    };
  }

  static async createOauthCode(opts: {
    sessionId: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    remember?: boolean;
    payload?: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
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
        expiresInSeconds: opts.expiresInSeconds ??
          OauthController.DefaultOauthCodeExpirySeconds,
      }),
    };
  }

  static verifyCodeChallenge(opts: {
    alg: OauthPKCEMethod;
    challenge: string;
    verifier: string;
  }) {
    try {
      return (
        createHash(opts.alg)
          .update(opts.verifier)
          .toString("base64")
          .split("=")[0]
          .replaceAll("+", "-")
          .replaceAll("/", "_") ===
          opts.challenge.split("=")[0].replaceAll("+", "-").replaceAll("/", "_")
      );
    } catch {
      return false;
    }
  }

  static async getAvailableScopes(userId: ObjectId | string) {
    const Collaborators = await CollaboratorModel.find({
      createdFor: new ObjectId(userId),
    })
      .sort({ isPrimary: -1 })
      .populateOne("account", AccountModel);

    return await Promise.all(
      // Require account details (name, description etc.)
      Collaborators.map(async (collaborator) => ({
        ...collaborator,
        scopes: Array.from(
          await SecurityGuard.resolveScopes(
            (
              await OauthPolicyModel.findOne({ role: collaborator.role })
            )?.scopes ?? [],
            {
              resolveScopeRole: ResolveScopeRole,
            },
          ),
        ),
      })),
    );
  }

  @Post("/local/", {
    middlewares: () => [verifyHuman()],
  })
  public authenticate() {
    // Define Body Schema
    const BodySchema = e.object({
      oauthAppId: e.string().checkpoint(),
      oauthApp: e
        .any()
        .custom(async (ctx) => {
          const App = await OauthAppModel.findOne(
            ctx.parent!.output.oauthAppId,
          ).project({
            _id: 1,
            "consent.allowedCallbackURLs": 1,
          });

          if (!App) throw new Error("Invalid oauth app id!");
          return App;
        })
        .checkpoint(),
      callbackURL: e.string().custom((ctx) => {
        if (
          !ctx.parent?.output.oauthApp.consent.allowedCallbackURLs.includes(
            new URL(ctx.output).toString(),
          )
        ) {
          throw "Return host not allowed!";
        }
      }),
      codeChallenge: e.optional(e.string().length({ min: 1, max: 500 })),
      codeChallengeMethod: e.optional(e.in(Object.values(OauthPKCEMethod))),
      remember: e.optional(e.boolean({ cast: true })).default(false),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Authorization Validation
        const Credentials = await e
          .object({
            username: UsernameValidator,
            password: e.string(),
          })
          .validate(ctx.router.state.credentials, {
            name: "oauth.credentials",
          });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "oauth.body" },
        );

        const User = await UserModel.findOne(
          ((await Env.get("ALLOW_CROSS_APP_AUTH", true)) ?? "0") === "1"
            ? { username: Credentials.username }
            : {
              oauthApp: new ObjectId(Body.oauthAppId),
              username: Credentials.username,
            },
        ).project({
          _id: 1,
          username: 1,
          password: 1,
          failedLoginAttempts: 1,
          loginCount: 1,
          isBlocked: 1,
        });

        login: if (User) {
          if (User.isBlocked) {
            return Response.status(false).message(
              "You have been blocked! Please reset your password.",
            );
          }

          // Authentication will always fail even if the password is correct, if multiple wrong attempts found!
          if (
            User.failedLoginAttempts > 5 ||
            !(await bcrypt.compare(Credentials.password, User.password))
          ) {
            break login;
          }

          // Update User
          await UserModel.updateOne(User._id, {
            failedLoginAttempts: 0,
            loginCount: User.loginCount + 1,
            deletionAt: null,
          });

          return Response.data({
            ...(await OauthController.createOauthAuthentication({
              provider: OauthProvider.LOCAL,
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

        await UserModel.updateOne(
          { username: Credentials.username },
          { $inc: { failedLoginAttempts: 1 } },
        );

        e.error("Invalid username or password!");
      },
    });
  }

  @Post("/exchange/authentication/")
  public exchangeAuthentication() {
    // Define Body Schema
    const BodySchema = e.object({
      authenticationToken: e.string().throwsFatal(),
      tokenPayload: e
        .any()
        .custom((ctx) =>
          OauthController.verifyToken<{
            provider: OauthProvider;
            sessionId: string;
            userId: string;
            oauthAppId: string;
            codeChallenge: string;
            codeChallengeMethod: string;
            remember: boolean;
          }>({
            type: OauthTokenType.AUTHENTICATION,
            token: ctx.parent!.output.authenticationToken,
          })
        )
        .throwsFatal(),
      scopes: e
        .record(e.array(e.string(), { cast: true }))
        .custom(async (ctx) => {
          const AccountIds = Object.keys(ctx.output);

          if (!AccountIds.length) throw "Invalid scope object!";

          await Promise.all(
            AccountIds.map(async (account) => {
              if (
                !(await CollaboratorModel.count({
                  account: new ObjectId(account),
                  createdFor: new ObjectId(
                    ctx.parent?.output.tokenPayload.userId ?? "",
                  ),
                }))
              ) {
                throw "Invalid account id in the scope!";
              }
            }),
          );
        }),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "oauth.body" },
        );

        // Create New Session
        const Session = await OauthController.createSession({
          provider: OauthProvider.LOCAL,
          sessionId: Body.tokenPayload.sessionId,
          userId: Body.tokenPayload.userId,
          oauthAppId: Body.tokenPayload.oauthAppId,
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
          scopes: Body.scopes,
          expiresInSeconds: OauthController.DefaultOauthRefreshExpirySeconds,
        });

        return Response.data(
          await OauthController.createOauthCode({
            sessionId: Session._id.toString(),
            codeChallenge: Body.tokenPayload.codeChallenge,
            codeChallengeMethod: Body.tokenPayload.codeChallengeMethod,
            remember: Body.tokenPayload.remember,
          }),
        ).statusCode(Status.Created);
      },
    });
  }

  @Post("/exchange/code/")
  public exchangeCode() {
    // Define Body Schema
    const BodySchema = e.object({
      code: e.string().throwsFatal(),
      codePayload: e
        .any()
        .custom((ctx) =>
          OauthController.verifyToken({
            type: OauthTokenType.CODE,
            token: ctx.parent!.output.code,
          })
        )
        .throwsFatal(),
      codeVerifier: e
        .optional(e.string().length({ min: 1, max: 500 }))
        .custom((ctx) => {
          if (ctx.parent?.output.codePayload.codeChallenge && !ctx.output) {
            throw "A code verifier is required!";
          }
        }),
      fcmDeviceToken: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "oauth.body" },
        );

        // Code Verification
        if (
          Body.codeVerifier &&
          !OauthController.verifyCodeChallenge({
            alg: Body.codePayload.codeChallengeMethod as OauthPKCEMethod,
            challenge: Body.codePayload.codeChallenge as string,
            verifier: Body.codeVerifier,
          })
        ) e.error("Invalid code verifier!");

        // Refresh Session
        const Session = await OauthController.refreshSession({
          sessionId: Body.codePayload.sessionId as string,
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
        });

        if (!Session) throw e.error("Invalid oauth code! Session not found.");

        if (Session.version > 1) throw e.error("Oauth code has been expired!");

        // Push Device Token
        if (Body.fcmDeviceToken) {
          // Background event may fetch the data based on this userId
          ctx.router.state.updateFcmDeviceTokens = Session.createdBy;

          await UserModel.updateOne(Session.createdBy, {
            $addToSet: {
              fcmDeviceTokens: Body.fcmDeviceToken,
            },
          });
        }

        return Response.data(
          await OauthController.createOauthAccessTokens({
            sessionId: Session._id.toString(),
            version: Session.version,
            refreshable: !!Body.codePayload.remember,
          }),
        );
      },
    });
  }

  @Post("/refresh/")
  public refresh() {
    // Define Body Schema
    const BodySchema = e.object({
      refreshToken: e.string().throwsFatal(),
      refreshTokenPayload: e.any().custom(
        async (ctx) =>
          (
            await OauthController.verifySession({
              type: OauthTokenType.REFRESH,
              token: ctx.parent!.output.refreshToken,
              useragent: ctx.context.useragent,
            })
          ).claims,
      ),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          {
            name: "oauth.body",
            context: {
              useragent: ctx.router.request.headers.get("User-Agent") ?? "",
            },
          },
        );

        // Refresh Session
        const Session = await OauthController.refreshSession({
          sessionId: Body.refreshTokenPayload.sessionId as string,
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
          expiresInSeconds: OauthController.DefaultOauthRefreshExpirySeconds,
        });

        if (!Session) throw e.error("Session refreshing failed!");

        return Response.data(
          await OauthController.createOauthAccessTokens({
            sessionId: Session._id,
            version: Session.version,
            refreshable: true,
          }),
        );
      },
    });
  }

  @Post("/local/quick/login/", {
    disabled: Env.is(EnvType.PRODUCTION),
  })
  public quickLogin(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      oauthAppId: e.optional(e.string()),
      scopes: e.optional(e.record(e.array(e.string()))),
      remember: e.optional(e.boolean({ cast: true })).default(false),
      asRole: e.optional(e.string()),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Authorization Validation
        let Credentials = await e.optional(
          e.object({
            username: UsernameValidator,
            password: e.string(),
          }),
        )
          .validate(ctx.router.state.credentials, {
            name: "oauth.credentials",
          });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        const UserAgent = ctx.router.request.headers.get("User-Agent") ?? "";
        const Context: Record<string, any> = {};

        // Fetch oauth app for authentication
        const OauthApp = (await fetch(
          ctx.router.app,
          new URL(
            `/api/oauth/apps/${Body.oauthAppId ?? "default"}/`,
            ctx.router.request.url.origin,
          ),
        ).then((_) => _?.json())) as any;

        Context.oauthApp = OauthApp;

        if (!OauthApp?.status) {
          return Response.statusCode(404)
            .message("Oauth app not found!")
            .data(Context);
        }

        if (!Credentials) {
          Credentials = {
            username: "tester",
            password: "Test123!",
          };

          if (!(await UserModel.exists({ username: Credentials.username }))) {
            const Register = (await fetch(
              ctx.router.app,
              new URL(
                `/api/users/${OauthApp.data._id}/`,
                ctx.router.request.url.origin,
              ),
              {
                method: "POST",
                body: JSON.stringify({
                  fname: "Tester",
                  phone: "+920000000000",
                  username: Credentials.username,
                  password: Credentials.password,
                }),
              },
            ).then((_) => _?.json())) as any;

            Context.user = Register;

            if (!Register?.status) {
              return Response.statusCode(500)
                .message("Tester registration failed!")
                .data(Context);
            }

            await UserModel.updateOneOrFail(Register.data._id, {
              role: Body.asRole ?? "user",
            });
          }
        }

        // Authenticate with the api
        const Authentication = (await fetch(
          ctx.router.app,
          new URL("/api/oauth/local/", ctx.router.request.url.origin),
          {
            method: "POST",
            headers: {
              "User-Agent": UserAgent,
              Authorization: `Basic ${
                btoa(
                  `${Credentials.username}:${Credentials.password}`,
                )
              }`,
            },
            body: JSON.stringify({
              oauthAppId: OauthApp.data._id,
              callbackURL: OauthApp.data.consent.allowedCallbackURLs[0],
              remember: Body.remember,
            }),
          },
        ).then((_) => _?.json())) as any;

        Context.authentication = Authentication;

        if (!Authentication?.status) {
          return Response.statusCode(400)
            .message("Authentication failed!")
            .data(Context);
        }

        // Exchange authentication token
        const ExchangeAuthentication = (await fetch(
          ctx.router.app,
          new URL(
            "/api/oauth/exchange/authentication/",
            ctx.router.request.url.origin,
          ),
          {
            method: "POST",
            headers: {
              "User-Agent": UserAgent,
            },
            body: JSON.stringify({
              authenticationToken:
                Authentication.data.authenticationToken.token,
              scopes: Body.scopes ?? {
                [Authentication.data.availableScopes[0].account._id]: ["*"],
              },
            }),
          },
        ).then((_) => _?.json())) as any;

        Context.exchangeAuth = ExchangeAuthentication;

        if (!ExchangeAuthentication?.status) {
          return Response.statusCode(400)
            .message("Exchange authentication failed!")
            .data(Context);
        }

        // Exchange oauth code
        const ExchangeCode = (await fetch(
          ctx.router.app,
          new URL("/api/oauth/exchange/code/", ctx.router.request.url.origin),
          {
            method: "POST",
            headers: {
              "User-Agent": UserAgent,
            },
            body: JSON.stringify({
              code: ExchangeAuthentication.data.oauthCode.token,
            }),
          },
        ).then((_) => _?.json())) as any;

        Context.exchangeCode = ExchangeCode;

        if (!ExchangeCode?.status) {
          return Response.statusCode(400)
            .message("Exchange code failed!")
            .data(Context);
        }

        return Response.data(Context);
      },
    });
  }

  @Post("/permit/")
  public createPermit(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      scopes: e.array(e.string(), { cast: true }).min(1),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (
          !ctx.router.state.auth?.sessionId ||
          !ctx.router.state.sessionInfo?.claims.version
        ) {
          ctx.router.throw(Status.Unauthorized);
        }

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        return Response.data(
          await OauthController.createOauthPermitToken({
            version: ctx.router.state.sessionInfo.claims.version,
            sessionId: ctx.router.state.auth.sessionId,
            scopes: Body.scopes,
          }),
        );
      },
    });
  }

  @Post("/secret/")
  public createSecret(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      name: e.string(),
      scopes: e.optional(
        e.or([
          e.record(e.array(e.string(), { cast: true })),
          e.array(e.string(), { cast: true }),
        ]),
      ),
      ttl: e.optional(e.number()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        return Response.data(
          await OauthController.createOauthSecret({
            name: Body.name,
            oauthAppId: ctx.router.state.auth.user.oauthApp,
            userId: ctx.router.state.auth.userId,
            scopes: (Body.scopes instanceof Array || Body.scopes === undefined)
              ? {
                [ctx.router.state.auth.accountId]: Body.scopes ??
                  ctx.router.state.scopePipeline.requested,
              }
              : Body.scopes,
            expiresInSeconds: Body.ttl,
          }),
        );
      },
    });
  }

  @Delete("/logout/")
  public logout() {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        allDevices: e.optional(e.boolean({ cast: true })),
        fcmDeviceToken: e.optional(e.string()),
      },
      { allowUnexpectedProps: true },
    );

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth?.sessionId) {
          ctx.router.throw(Status.Unauthorized);
        }

        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: "users.query" },
        );

        // Delete OauthSession
        if (Query.allDevices) {
          await OauthSessionModel.deleteMany({
            createdBy: new ObjectId(ctx.router.state.auth.userId),
          });
        } else {
          await OauthSessionModel.deleteOne(
            ctx.router.state.auth.sessionId,
          );
        }

        if (Query.allDevices || Query.fcmDeviceToken) {
          // Background event may fetch the data based on this userId
          ctx.router.state.updateFcmDeviceTokens = ctx.router.state.auth.userId;

          await UserModel.updateOne(
            ctx.router.state.auth.userId,
            Query.allDevices
              ? { fcmDeviceTokens: [] as string[] }
              : { $pull: { fcmDeviceTokens: Query.fcmDeviceToken! } },
          );
        }

        return Response.true();
      },
    });
  }
}
