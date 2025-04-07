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
import { ObjectId } from "mongo";
import { Wallet } from "@Lib/wallet.ts";

import { WalletModel } from "@Models/wallet.ts";
import { TransactionModel } from "@Models/transaction.ts";
import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";
import { responseValidator } from "@Core/common/validators.ts";

@Controller("/manage/wallets/", { group: "Wallet", name: "manageWallets" })
export default class ManageWalletsController extends BaseController {
  @Get("/all/:id?/")
  public getAll(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.object({
      search: e.optional(e.string()),
      range: e.optional(
        e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true }),
      ),
      offset: e.optional(e.number({ cast: true }).min(0)).default(0),
      limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
      sort: e.optional(e.record(
        e.number({ cast: true }).min(-1).max(1),
        { cast: true },
      )).default({ _id: -1 }),
      project: e.optional(
        e.record(e.number({ cast: true }).min(0).max(1), { cast: true }),
      ),
      includeTotalCount: e.optional(
        e
          .boolean({ cast: true })
          .describe(
            "If `true` is passed, the system will return a total items count for pagination purpose.",
          ),
      ),
    }, { allowUnexpectedProps: true });

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(WalletModel.getSchema()),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
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

        const WalletListQuery = WalletModel
          .search(Query.search)
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
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) WalletListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await WalletModel.count()
            : undefined,
          results: await WalletListQuery,
        });
      },
    });
  }

  @Post("/balance/list/:accountId/")
  public balanceList(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      accountId: e.string(),
    });

    // Define Body Schema
    const BodySchema = e.object({
      types: e.optional(e.array(e.string())),
      currencies: e.optional(e.array(e.string())),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
        return: responseValidator(e.array(WalletModel.getSchema())).toSample(),
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

        return Response.data(
          await Wallet.list(Params.accountId, Body),
        );
      },
    });
  }

  @Get("/transactions/:accountId/:type?/:currency?/")
  public transactions(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.deepCast(e.object(
      {
        search: e.optional(e.string()),
        sent: e.optional(e.boolean()),
        received: e.optional(e.boolean()),
        range: e.optional(
          e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true }),
        ),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        sort: e.optional(
          e.record(e.number({ cast: true }).min(-1).max(1), { cast: true }),
        ).default({ _id: -1 }),
        project: e.optional(
          e.record(e.number({ cast: true }).min(0).max(1), { cast: true }),
        ),
        includeTotalCount: e.optional(
          e
            .boolean({ cast: true })
            .describe(
              "If `true` is passed, the system will return a total items count for pagination purpose.",
            ),
        ),
      },
      { allowUnexpectedProps: true },
    ));

    // Define Params Schema
    const ParamsSchema = e.object({
      accountId: e.string(),
      type: e.optional(e.string()).default(() => Wallet.getDefaultType()),
      currency: e
        .optional(e.string())
        .default(() => Wallet.getDefaultCurrency()),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(TransactionModel.getSchema()),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` },
        );

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const TargetAccountId = new ObjectId(Params.accountId);

        const targets = [
          ...(Query.sent ? [{ from: TargetAccountId }] : []),
          ...(Query.received ? [{ to: TargetAccountId }] : []),
        ];

        const TransactionListBaseConditions = {
          ...(targets.length === 1 ? targets[0] : {
            $or: targets.length ? targets : [
              { from: TargetAccountId },
              { to: TargetAccountId },
            ],
          }),
          type: Params.type,
          currency: Params.currency,
          ...(Query.range instanceof Array
            ? {
              createdAt: {
                $gt: new Date(Query.range[0]),
                $lt: new Date(Query.range[1]),
              },
            }
            : {}),
        };

        const TransactionListQuery = TransactionModel.search(Query.search)
          .filter(TransactionListBaseConditions)
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit);

        if (Query.project) TransactionListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await TransactionModel.count(TransactionListBaseConditions)
            : undefined,
          results: await TransactionListQuery,
        });
      },
    });
  }

  @Post("/charge/:type?/:currency?/")
  public charge(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    });

    // Define Body Schema
    const BodySchema = e.object({
      payer: e.string(),
      amount: e.number({ cast: true }),
      description: e.optional(e.string().max(300)),
      metadata: e.optional(
        e.record(e.or([e.number(), e.boolean(), e.string()]), { cast: true }),
      ),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
        return: responseValidator(e.object({
          transaction: TransactionModel.getSchema(),
        })).toSample(),
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

        const [payerId, accountId] = Body.payer.split(":");

        const PayerUser = await UserModel.findOne({
          $or: [
            ...(ObjectId.isValid(payerId)
              ? [{ _id: new ObjectId(payerId) }]
              : []),
            { username: payerId },
            { email: payerId },
            { phone: payerId },
          ],
        }).project({
          _id: 1,
          fname: 1,
          mname: 1,
          lname: 1,
          avatar: 1,
        });

        if (!PayerUser) {
          throw e.error(
            `Payer user not found!`,
            `${route.scope}.body.payer`,
          );
        }

        const PayerAccount = await AccountModel.findOne({
          ...(ObjectId.isValid(accountId)
            ? { _id: new ObjectId(accountId) }
            : {}),
          createdFor: PayerUser._id,
        }).project({
          _id: 1,
        });

        if (!PayerAccount) throw e.error("Payer account not found!");

        const Transfer = await Wallet.transfer({
          fromName: [
            PayerUser.fname,
            PayerUser.mname!,
            PayerUser.lname!,
          ],
          from: PayerAccount._id,
          sender: PayerUser._id,
          toName: [
            ctx.router.state.auth.user.fname,
            ctx.router.state.auth.user.mname!,
            ctx.router.state.auth.user.lname!,
          ],
          to: ctx.router.state.auth.accountId,
          receiver: ctx.router.state.auth.userId,
          user: ctx.router.state.auth.userId,
          type: Params.type,
          currency: Params.currency,
          amount: Body.amount,
          description: Body.description,
          metadata: Body.metadata,
          allowOverdraft: true,
        });

        return Response.statusCode(Status.Created).data({
          transaction: Transfer.transaction,
        });
      },
    });
  }

  @Delete("/refund/:id/")
  public refund(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          transaction: TransactionModel.getSchema(),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const Transfer = await Wallet.refund({
          transactionId: Params.id,
          user: ctx.router.state.auth.userId,
          allowOverdraft: true,
        });

        return Response.data({
          transaction: Transfer.transaction,
        });
      },
    });
  }
}
