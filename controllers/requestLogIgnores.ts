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
import e, { inferOutput } from "validator";
import { ObjectId } from "mongo";

import {
  InputRequestLogIgnoreSchema,
  RequestLogIgnoreModel,
} from "@Models/requestLogIgnore.ts";
import { InputRequestLogsSchema } from "@Models/requestLog.ts";

@Controller("/request/log/ignores/", {
  group: "System",
  name: "requestLogIgnores",
})
export default class RequestLogIgnoresController extends BaseController {
  static async isIgnored(log: inferOutput<typeof InputRequestLogsSchema>) {
    const filters = await RequestLogIgnoreModel.find({}, {
      cache: { key: "requestLogFilters", ttl: 600 },
    });

    let ignore = false;

    for (const filter of filters) {
      if (ignore) break;

      if (filter.method?.length && filter.method.includes(log.method)) {
        ignore = true;
      }

      if (filter.responseStatus?.length) {
        if (
          log.responseStatus >= filter.responseStatus[0] &&
          log.responseStatus <= filter.responseStatus[1]
        ) {
          ignore = true;
        }
      }

      if (filter.url) {
        const regex = new RegExp(filter.url);

        if (regex.test(log.url)) {
          ignore = true;
        }
      }
    }

    return ignore;
  }

  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputRequestLogIgnoreSchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(RequestLogIgnoreModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        return Response.statusCode(Status.Created).data(
          await RequestLogIgnoreModel.create({
            ...Body,
            createdBy: ctx.router.state.auth?.userId,
            account: ctx.router.state.auth?.accountId,
          }),
        );
      },
    });
  }

  @Patch("/:id/")
  public update(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.instanceOf(ObjectId, { instantiate: true }),
    });

    // Define Body Schema
    const BodySchema = e.partial(InputRequestLogIgnoreSchema);

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
        return: responseValidator(e.partial(RequestLogIgnoreModel.getSchema()))
          .toSample(),
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

        const { modifications } = await RequestLogIgnoreModel.updateOneOrFail(
          Params.id,
          Body,
        );

        return Response.data(modifications);
      },
    });
  }

  @Get("/:id?/")
  public get(route: IRoute) {
    // Define Query Schema
    const QuerySchema = queryValidator();

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(RequestLogIgnoreModel.getSchema()),
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

        const RequestLogIgnoresBaseFilters = {
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
        };

        const RequestLogIgnoresListQuery = RequestLogIgnoreModel
          .search(Query.search)
          .filter(RequestLogIgnoresBaseFilters)
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) RequestLogIgnoresListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await RequestLogIgnoreModel.count(RequestLogIgnoresBaseFilters)
            : undefined,
          results: await RequestLogIgnoresListQuery,
        });
      },
    });
  }

  @Delete("/:id/")
  public delete(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.instanceOf(ObjectId, { instantiate: true }),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator().toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        await RequestLogIgnoreModel.deleteOneOrFail(Params.id);

        return Response.true();
      },
    });
  }
}
