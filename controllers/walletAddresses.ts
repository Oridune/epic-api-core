import {
  BaseController,
  Controller,
  Delete,
  Get,
  type IRequestContext,
  type IRoute,
  Patch,
  Post,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { responseValidator } from "@Core/common/validators.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { queryValidator } from "@Core/common/validators.ts";
import { ObjectId } from "mongo";

import {
  InputWalletAddressSchema,
  WalletAddressModel,
} from "@Models/walletAddress.ts";

@Controller("/wallet/addresses/", { group: "Wallet", name: "walletAddresses" })
export default class WalletAddressesController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputWalletAddressSchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(WalletAddressModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        return Response.statusCode(Status.Created).data(
          await WalletAddressModel.create({
            ...Body,
            createdBy: ctx.router.state.auth.userId,
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
    const BodySchema = e.partial(InputWalletAddressSchema);

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
        return: responseValidator(e.partial(WalletAddressModel.getSchema()))
          .toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const { modifications } = await WalletAddressModel.updateOneOrFail(
          {
            _id: Params.id,
            createdBy: new ObjectId(ctx.router.state.auth.userId),
          },
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
          results: e.array(WalletAddressModel.getSchema()),
        })).toSample(),
      }),
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

        const WalletAddressesBaseFilters = {
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

        const WalletAddressesListQuery = WalletAddressModel
          .search(Query.search)
          .filter(WalletAddressesBaseFilters)
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) WalletAddressesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await WalletAddressModel.count(WalletAddressesBaseFilters)
            : undefined,
          results: await WalletAddressesListQuery,
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
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        await WalletAddressModel.deleteOneOrFail({
          _id: Params.id,
          createdBy: new ObjectId(ctx.router.state.auth.userId),
        });

        return Response.true();
      },
    });
  }
}
