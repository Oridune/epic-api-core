import {
  BaseController,
  Controller,
  Delete,
  Get,
  type IRequestContext,
  type IRoute,
  parseQueryParams,
  Patch,
  Post,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import {
  normalizeFilters,
  queryValidator,
  responseValidator,
} from "@Core/common/validators.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";

import { OauthPolicyModel } from "@Models/oauthPolicy.ts";

export const InputOauthPolicySchema = e.object({
  role: e.string(),
  scopes: e.array(e.string()),
  subRoles: e.optional(e.array(e.string())),
});

@Controller("/oauth/policies/", { group: "Oauth", name: "oauthPolicies" })
export default class OauthPoliciesController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputOauthPolicySchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(OauthPolicyModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        return Response.statusCode(Status.Created).data(
          await OauthPolicyModel.create(Body),
        );
      },
    });
  }

  @Patch("/:id/")
  public update(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    // Define Body Schema
    const BodySchema = e.partial(InputOauthPolicySchema);

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        await OauthPolicyModel.updateOne(Params.id, Body);

        return Response.true();
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
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(OauthPolicyModel.getSchema()),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          parseQueryParams(ctx.router.request.url.search),
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

        const OauthPoliciesListQuery = OauthPolicyModel.search(Query.search)
          .filter({
            ...normalizeFilters(Query.filters),
            ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
            ...(Query.range instanceof Array
              ? {
                createdAt: {
                  $gt: new Date(Query.range[0]),
                  $lt: new Date(Query.range[1]),
                },
              }
              : {}),
          })
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) OauthPoliciesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await OauthPolicyModel.count()
            : undefined,
          results: await OauthPoliciesListQuery,
        });
      },
    });
  }

  @Get("/me/")
  public me() {
    return new Versioned().add("1.0.0", {
      shape: () => ({
        return: responseValidator(e.object({
          policy: OauthPolicyModel.getSchema(),
          scopePipeline: e.array(e.array(e.string())),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        const Policy = await OauthPolicyModel.findOne({
          role: ctx.router.state.auth.resolvedRole,
        });

        if (!Policy) throw e.error("Policy not found!");

        return Response.data({
          policy: Policy,
          scopePipeline: ctx.router.state.guard.toJSON().scopePipeline,
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
      shape: () => ({
        params: ParamsSchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        await OauthPolicyModel.deleteOne(Params.id);

        return Response.true();
      },
    });
  }
}
