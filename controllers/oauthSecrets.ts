import {
  BaseController,
  Controller,
  Delete,
  Get,
  type IRequestContext,
  type IRoute,
  Post,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { queryValidator } from "@Core/common/validators.ts";
import { ObjectId } from "mongo";

import OauthController, {
  OauthTokenType,
  OauthTokenVerifyOptions,
} from "@Controllers/oauth.ts";
import { OauthSecretModel } from "@Models/oauthSecret.ts";

@Controller("/oauth/secrets/", { name: "oauthSecrets" })
export default class OauthSecretsController extends BaseController {
  static async createSecret(opts: {
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

  static async verifySecret(opts: {
    token: string;
    verifyOpts?: OauthTokenVerifyOptions;
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

    if (Secret.isBlocked) throw new Error(`Your secret key has been blocked!`);

    return {
      claims: Claims,
      secret: Secret,
    };
  }

  @Post("/behalf/")
  public createFor(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      userId: e.string(),
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
      shape: () => ({
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        return Response.data(
          await OauthSecretsController.createSecret({
            oauthAppId: ctx.router.state.auth.user.oauthApp,
            userId: Body.userId,
            name: Body.name,
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

  @Post("/")
  public create(route: IRoute) {
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
      shape: () => ({
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        return Response.data(
          await OauthSecretsController.createSecret({
            oauthAppId: ctx.router.state.auth.user.oauthApp,
            userId: ctx.router.state.auth.userId,
            name: Body.name,
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

  @Get("/:id?/")
  public get(route: IRoute) {
    // Define Query Schema
    const QuerySchema = queryValidator();

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      shape: {
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` },
        );

        /**
         * It is recommended to keep the following validators in place even if you don't want to validate any data.
         * It will prevent the client from injecting unexpected data into the request.
         */

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const OauthSecretsBaseFilters = {
          ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
          createdBy: new ObjectId(ctx.router.state.auth.userId),
          ...(Query.range instanceof Array
            ? {
              createdAt: {
                $gt: new Date(Query.range[0]),
                $lt: new Date(Query.range[1]),
              },
            }
            : {}),
        };

        const OauthSecretsListQuery = OauthSecretModel
          .search(Query.search)
          .filter(OauthSecretsBaseFilters)
          .skip(Query.offset)
          .limit(Query.limit)
          .sort(Query.sort);

        if (Query.project) OauthSecretsListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await OauthSecretModel.count(OauthSecretsBaseFilters)
            : undefined,
          results: await OauthSecretsListQuery,
        });
      },
    });
  }

  @Delete("/:id/")
  public delete(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    return Versioned.add("1.0.0", {
      shape: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        await OauthSecretModel.deleteOneOrFail({
          _id: new ObjectId(Params.id),
          createdBy: new ObjectId(ctx.router.state.auth.userId),
        });

        return Response.true();
      },
    });
  }
}
