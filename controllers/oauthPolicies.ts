import {
  Controller,
  BaseController,
  Get,
  Post,
  Patch,
  Delete,
  Versioned,
  Response,
  type IRoute,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import { ObjectId } from "mongo";

import { OauthPolicyModel } from "@Models/oauthPolicy.ts";

export const InputOauthPolicySchema = () =>
  e.object({
    role: e.string(),
    scopes: e.array(e.string()),
    subRoles: e.optional(e.array(e.string())),
  });

@Controller("/oauth/policies/", { name: "oauthPolicies" })
export default class OauthPoliciesController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputOauthPolicySchema();

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        return Response.statusCode(Status.Created).data(
          await OauthPolicyModel.create(Body)
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
      postman: {
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        await OauthPolicyModel.updateOne(Params.id, Body);

        return Response.true();
      },
    });
  }

  @Get("/:id?/")
  public get(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.object(
      {
        search: e.optional(e.string()),
        range: e.optional(
          e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true })
        ),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        sort: e
          .optional(
            e.record(e.number({ cast: true }).min(-1).max(1), { cast: true })
          )
          .default({ _id: -1 }),
        project: e.optional(
          e.record(e.number({ cast: true }).min(0).max(1), { cast: true })
        ),
        includeTotalCount: e.optional(
          e
            .boolean({ cast: true })
            .describe(
              "If `true` is passed, the system will return a total items count for pagination purpose."
            )
        ),
      },
      { allowUnexpectedProps: true }
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` }
        );

        /**
         * It is recommended to keep the following validators in place even if you don't want to validate any data.
         * It will prevent the client from injecting unexpected data into the request.
         *
         * */

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const OauthPoliciesListQuery = OauthPolicyModel.search(Query.search)
          .filter({
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
          .skip(Query.offset)
          .limit(Query.limit)
          .sort(Query.sort);

        if (Query.project) OauthPoliciesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            ? //? Make sure to pass any limiting conditions for count if needed.
              await OauthPolicyModel.count()
            : undefined,
          results: await OauthPoliciesListQuery,
        });
      },
    });
  }

  @Get("/me/")
  public me() {
    return new Versioned().add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        const Policy = await OauthPolicyModel.findOne({
          role: ctx.router.state.auth.resolvedRole,
        });

        if (!Policy) throw e.error("Policy not found!");

        return Response.data(Policy);
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
      postman: {
        params: ParamsSchema.toSample(),
      },
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
