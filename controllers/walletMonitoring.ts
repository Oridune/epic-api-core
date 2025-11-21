import {
  BaseController,
  Controller,
  Get,
  type IRequestContext,
  type IRoute,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { queryValidator, responseValidator } from "@Core/common/validators.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { WalletModel } from "@Models/wallet.ts";
import { AccountModel } from "@Models/account.ts";
import { UserModel } from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { allowPopulate } from "@Helpers/utils.ts";

@Controller("/wallet/monitoring/", {
  group: "Wallet",
  name: "walletMonitoring",
})
export default class WalletMonitoringController extends BaseController {
  @Get("/all/negative/:id?/")
  public getAllNegative(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object({
      olderThan: e.optional(e.date()),
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    }, { allowUnexpectedProps: true }).extends(queryValidator());

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
          results: e.array(e.omit(WalletModel.getSchema(), ["digest"])),
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

        const WalletBaseFilters = {
          ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
          balance: { $lt: 0 },
          ...(Query.olderThan instanceof Date
            ? { negativeAt: { $lte: Query.olderThan } }
            : {}),
          ...(Query.type ? { type: Query.type } : {}),
          ...(Query.currency ? { currency: Query.currency } : {}),
          ...(Query.range instanceof Array
            ? {
              updatedAt: {
                $gt: new Date(Query.range[0]),
                $lt: new Date(Query.range[1]),
              },
            }
            : {}),
        };

        const WalletAddressesListQuery = WalletModel
          .search(Query.search)
          .filter(WalletBaseFilters)
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit)
          .project({ digest: 0 })
          .populateOne("account", AccountModel, {
            project: { name: 1, logo: 1 },
            disabled: !allowPopulate(/^account.*/, Query.project),
          })
          .populateOne("createdBy", UserModel, {
            project: { fname: 1, mname: 1, lname: 1, avatar: 1, username: 1 },
            disabled: !allowPopulate(/^createdBy.*/, Query.project),
          });

        if (Query.project) WalletAddressesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await WalletModel.count(WalletBaseFilters)
            : undefined,
          results: await WalletAddressesListQuery,
        });
      },
    });
  }

  @Get("/negative/:id?/")
  public getNegative(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object({
      olderThan: e.optional(e.date()),
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    }, { allowUnexpectedProps: true }).extends(queryValidator());

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
          results: e.array(e.omit(WalletModel.getSchema(), ["digest"])),
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

        const collaborations = await CollaboratorModel.find({
          account: new ObjectId(ctx.router.state.auth.accountId),
          isOwned: { $ne: true },
        }).project({ createdFor: 1 });

        const accounts = await AccountModel.find({
          createdFor: { $in: collaborations.map(($) => $.createdFor) },
        }).project({ _id: 1 });

        const WalletBaseFilters = {
          ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
          ...(Query.type ? { type: Query.type } : {}),
          ...(Query.currency ? { currency: Query.currency } : {}),
          account: { $in: accounts.map(($) => $._id) },
          balance: { $lt: 0 },
          ...(Query.olderThan instanceof Date
            ? { negativeAt: { $lte: Query.olderThan } }
            : {}),
          ...(Query.range instanceof Array
            ? {
              updatedAt: {
                $gt: new Date(Query.range[0]),
                $lt: new Date(Query.range[1]),
              },
            }
            : {}),
        };

        const WalletAddressesListQuery = WalletModel
          .search(Query.search)
          .filter(WalletBaseFilters)
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit)
          .project({ digest: 0 })
          .populateOne("account", AccountModel, {
            project: { name: 1, logo: 1 },
            disabled: !allowPopulate(/^account.*/, Query.project),
          })
          .populateOne("createdBy", UserModel, {
            project: { fname: 1, mname: 1, lname: 1, avatar: 1, username: 1 },
            disabled: !allowPopulate(/^createdBy.*/, Query.project),
          });

        if (Query.project) WalletAddressesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await WalletModel.count(WalletBaseFilters)
            : undefined,
          results: await WalletAddressesListQuery,
        });
      },
    });
  }
}
