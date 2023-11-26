import {
  Controller,
  BaseController,
  Response,
  Post,
  Delete,
  type IRequestContext,
  type IRoute,
  Env,
  Versioned,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";
import { SignJWT, jwtVerify, JWTVerifyOptions, JWTPayload } from "jose";
import { createHash } from "hash";
import { ObjectId } from "mongo";
import { UsernameValidator, UserModel } from "@Models/user.ts";
import { OauthProvider, OauthSessionModel } from "@Models/oauth-session.ts";
import { OauthAppModel } from "@Models/oauth-app.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { OauthPolicyModel } from "@Models/oauth-policy.ts";
import { AccountModel } from "@Models/account.ts";

export enum OauthTokenType {
  AUTHENTICATION = "oauth_authentication",
  CODE = "oauth_code",
  REFRESH = "oauth_refresh_token",
  ACCESS = "oauth_access_token",
  PERMIT = "oauth_permit",
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

export const DefaultOauthIssuer = await Env.get("DISPLAY_NAME");
export const DefaultOauthAudience = await Env.get("DISPLAY_NAME");

@Controller("/oauth/", { group: "Oauth", name: "oauth" })
export default class OauthController extends BaseController {
  static DefaultOauthIssuer = DefaultOauthIssuer;
  static DefaultOauthAudience = DefaultOauthAudience;

  static DefaultOauthTokenExpirySeconds = 300; // 5m
  static DefaultOauthAuthenticationExpirySeconds = 180; // 3m
  static DefaultOauthCodeExpirySeconds = 300; // 5m
  static DefaultRefreshTokenExpirySeconds = 86400; // 1d
  static DefaultAccessTokenExpirySeconds = 300; // 5m

  static async createToken<T extends string>(opts: {
    type: T;
    payload: Record<
      string,
      string | string[] | number | boolean | null | undefined
    >;
    secret?: string;
    issuer?: string;
    audience?: string;
    expiresInSeconds?: number;
  }) {
    const JWTSecret = new TextEncoder().encode(
      (opts.secret ?? "") + (await Env.get("ENCRYPTION_KEY"))
    );
    const Issuer = opts.issuer ?? OauthController.DefaultOauthIssuer;
    const Audience = opts.audience ?? OauthController.DefaultOauthAudience;

    const CurrentDate = Date.now();
    const ExpiresAtSeconds = parseInt(
      (
        CurrentDate / 1000 +
        (opts.expiresInSeconds ??
          OauthController.DefaultOauthTokenExpirySeconds)
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
            expiresInSeconds:
              opts.refreshTokenExpiresInSeconds ??
              OauthController.DefaultRefreshTokenExpirySeconds,
          })
        : undefined,
      access: await OauthController.createOauthToken({
        type: OauthTokenType.ACCESS,
        payload: { ...opts.payload, ...Payload },
        issuer: opts.issuer,
        audience: opts.audience,
        expiresInSeconds:
          opts.accessTokenExpiresInSeconds ??
          OauthController.DefaultAccessTokenExpirySeconds *
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
        expiresInSeconds:
          opts.expiresInSeconds ??
          OauthController.DefaultAccessTokenExpirySeconds * 2,
      }),
    };
  }

  static async verifyToken<P>(opts: IOauthVerifyOptions) {
    const JWTSecret = new TextEncoder().encode(
      (opts.secret ?? "") + (await Env.get("ENCRYPTION_KEY"))
    );

    const JWTResults = await jwtVerify(opts.token, JWTSecret, {
      subject: opts.type,
      issuer: OauthController.DefaultOauthIssuer,
      audience: OauthController.DefaultOauthAudience,
      ...opts.verifyOpts,
    });

    return JWTResults.payload as P & JWTPayload;
  }

  static async createSession(opts: {
    provider: OauthProvider;
    sessionId: ObjectId | string;
    userId: ObjectId | string;
    oauthAppId: ObjectId | string;
    useragent: string;
    scopes: Record<string, string[]>;
    expiresInSeconds?: number;
  }) {
    const Session = await OauthSessionModel.create({
      _id: new ObjectId(opts.sessionId),
      createdBy: new ObjectId(opts.userId),
      provider: opts.provider,
      useragent: opts.useragent,
      oauthApp: new ObjectId(opts.oauthAppId),
      version: 0,
      scopes: opts.scopes,
      expiresAt: new Date(
        Date.now() +
          (opts.expiresInSeconds ??
            OauthController.DefaultRefreshTokenExpirySeconds) *
            1000
      ),
    });

    return Session;
  }

  static async refreshSession(opts: {
    sessionId: string;
    useragent: string;
    expiresInSeconds?: number;
  }) {
    const Session = await OauthSessionModel.findOne(opts.sessionId).project({
      _id: 1,
      version: 1,
      useragent: 1,
      expiresAt: 1,
    });

    if (!Session) throw new Error("An active session was not found!");

    return await OauthSessionModel.updateAndFindOne(Session._id, {
      version: Session.version + 1,
      useragent: opts.useragent,
      expiresAt: new Date(
        Date.now() +
          (opts.expiresInSeconds ??
            OauthController.DefaultRefreshTokenExpirySeconds) *
            1000
      ),
    });
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

    const Session = await OauthSessionModel.findOne(Claims.sessionId as string);

    if (!Session) throw new Error(`An active session was not found!`);

    if (
      [undefined, true].includes(opts.useragentCheck) &&
      Session.useragent !== opts.useragent
    )
      throw new Error(`Your session is invalid!`);

    if (Session.version !== Claims.version) {
      await OauthSessionModel.deleteOne(Session._id);
      throw new Error(`Your session has been expired!`);
    }

    return {
      claims: Claims,
      session: Session,
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
        expiresInSeconds:
          opts.expiresInSeconds ??
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
    return await Promise.all(
      // Require account details (name, description etc.)
      (
        await CollaboratorModel.find({
          createdFor: new ObjectId(userId),
        }).populateOne("account", AccountModel)
      ).map(async (collaborator) => ({
        ...collaborator,
        scopes:
          (
            await OauthPolicyModel.findOne({ role: collaborator.role })
          )?.scopes ?? [],
      }))
    );
  }

  @Post("/local/")
  public authenticate() {
    // Define Body Schema
    const BodySchema = e.object({
      oauthAppId: e.string().checkpoint(),
      oauthApp: e
        .any()
        .custom(async (ctx) => {
          const App = await OauthAppModel.findOne(
            ctx.parent!.output.oauthAppId
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
            new URL(ctx.output).toString()
          )
        )
          throw "Return host not allowed!";
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
            username: UsernameValidator(),
            password: e.string(),
          })
          .validate(ctx.router.state.credentials, {
            name: "oauth.credentials",
          });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "oauth.body" }
        );

        const User = await UserModel.findOne(
          ((await Env.get("ALLOW_CROSS_APP_AUTH", true)) ?? "0") === "1"
            ? { username: Credentials.username }
            : {
                oauthApp: new ObjectId(Body.oauthAppId),
                username: Credentials.username,
              }
        ).project({
          _id: 1,
          username: 1,
          password: 1,
          failedLoginAttempts: 1,
          loginCount: 1,
          isBlocked: 1,
        });

        login: if (User) {
          if (User.isBlocked)
            return Response.status(false).message(
              "You have been blocked! Please reset your password."
            );

          // Authentication will always fail even if the password is correct, if multiple wrong attempts found!
          if (
            User.failedLoginAttempts > 5 ||
            !(await bcrypt.compare(Credentials.password, User.password))
          )
            break login;

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
          { $inc: { failedLoginAttempts: 1 } }
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
        .record(e.array(e.string().matches(/\w+(\.\w+)*|^\*$/), { cast: true }))
        .custom(async (ctx) => {
          await Promise.all(
            Object.keys(ctx.output).map(async (account) => {
              if (
                !(await CollaboratorModel.count({
                  account: new ObjectId(account),
                  createdFor: new ObjectId(
                    ctx.parent?.output.tokenPayload.userId ?? ""
                  ),
                }))
              )
                throw "Invalid account id in the scope!";
            })
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
          { name: "oauth.body" }
        );

        // Create New Session
        const Session = await OauthController.createSession({
          provider: OauthProvider.LOCAL,
          sessionId: Body.tokenPayload.sessionId,
          userId: Body.tokenPayload.userId,
          oauthAppId: Body.tokenPayload.oauthAppId,
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
          scopes: Body.scopes,
        });

        return Response.data(
          await OauthController.createOauthCode({
            sessionId: Session._id.toString(),
            codeChallenge: Body.tokenPayload.codeChallenge,
            codeChallengeMethod: Body.tokenPayload.codeChallengeMethod,
            remember: Body.tokenPayload.remember,
          })
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
          if (ctx.parent?.output.codePayload.codeChallenge && !ctx.output)
            throw "A code verifier is required!";
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
          { name: "oauth.body" }
        );

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
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
        });

        if (!Session) throw e.error("Invalid oauth code! Session not found.");

        if (Session.version > 1) throw e.error("Oauth code has been expired!");

        return Response.data(
          await OauthController.createOauthAccessTokens({
            sessionId: Session._id.toString(),
            version: Session.version,
            refreshable: !!Body.codePayload.remember,
          })
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
          ).claims
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
          }
        );

        // Refresh Session
        const Session = await OauthController.refreshSession({
          sessionId: Body.refreshTokenPayload.sessionId as string,
          useragent: ctx.router.request.headers.get("User-Agent") ?? "",
        });

        if (!Session) throw e.error("Session refreshing failed!");

        return Response.data(
          await OauthController.createOauthAccessTokens({
            sessionId: Session._id,
            version: Session.version,
            refreshable: true,
          })
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
      },
      { allowUnexpectedProps: true }
    );

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: "users.query" }
        );

        // Delete OauthSession
        if (Query.allDevices)
          await OauthSessionModel.deleteMany({
            createdBy: new ObjectId(ctx.router.state.auth.userId),
          });
        else await OauthSessionModel.deleteOne(ctx.router.state.auth.sessionId);

        return Response.true();
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
        if (!ctx.router.state.auth || !ctx.router.state.sessionInfo)
          ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        return Response.data(
          await OauthController.createOauthPermitToken({
            version: ctx.router.state.sessionInfo.claims.version,
            sessionId: ctx.router.state.auth.sessionId,
            scopes: Body.scopes,
          })
        );
      },
    });
  }
}
