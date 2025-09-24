import {
  BaseController,
  Controller,
  Delete,
  Get,
  type IRequestContext,
  type IRoute,
  parseQueryParams,
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

import { InputRequestLogsSchema, RequestLogModel } from "@Models/requestLog.ts";
import RequestLogIgnoresController from "@Controllers/requestLogIgnores.ts";

@Controller("/request/logs/", { group: "System", name: "requestLogs" })
export default class RequestLogsController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputRequestLogsSchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(RequestLogModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        if (await RequestLogIgnoresController.isIgnored(Body)) {
          return Response.false().message("Log has been ignored!");
        }

        return Response.statusCode(Status.Created).data(
          await RequestLogModel.create({
            ...Body,
            createdBy: ctx.router.state.auth?.userId,
            account: ctx.router.state.auth?.accountId,
          }),
        );
      },
    });
  }

  @Get("/:id?/")
  public get(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.deepCast(
      e.object(
        {
          namespace: e.optional(e.string()),
        },
        { allowUnexpectedProps: true },
      ).extends(queryValidator()),
    );

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
          results: e.array(RequestLogModel.getSchema()),
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

        const RequestLogsBaseFilters = {
          ...normalizeFilters(Query.filters),
          account: (ctx.router.state.auth?.accountId &&
            new ObjectId(ctx.router.state.auth.accountId)) as
              | undefined
              | ObjectId,
          ...(Query.range instanceof Array
            ? {
              createdAt: {
                $gt: new Date(Query.range[0]),
                $lt: new Date(Query.range[1]),
              },
            }
            : {}),
        };

        const RequestLogsListQuery = RequestLogModel
          .search(Query.search)
          .filter({
            ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
            ...(Query.namespace ? { namespace: Query.namespace } : {}),
            ...RequestLogsBaseFilters,
          })
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) RequestLogsListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await RequestLogModel.count(RequestLogsBaseFilters)
            : undefined,
          results: await RequestLogsListQuery,
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

        await RequestLogModel.deleteOneOrFail({
          _id: new ObjectId(Params.id),
          account: ctx.router.state.auth?.accountId &&
            new ObjectId(ctx.router.state.auth.accountId),
        });

        return Response.true();
      },
    });
  }
}
