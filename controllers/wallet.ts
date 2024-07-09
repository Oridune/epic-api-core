import {
  BaseController,
  Controller,
  Env,
  EnvType,
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
import UsersIdentificationController, {
  IdentificationMethod,
  IdentificationPurpose,
} from "@Controllers/usersIdentification.ts";

import { UserModel } from "@Models/user.ts";
import { TransactionModel } from "@Models/transaction.ts";
import { AccountModel } from "@Models/account.ts";
import { TFileOutput } from "@Models/file.ts";

@Controller("/wallet/", { name: "wallet" })
export default class WalletController extends BaseController {
  @Get("/metadata/")
  public metadata() {
    return async () => {
      const [
        defaultType,
        availableTypes,
        defaultCurrency,
        availableCurrencies,
      ] = await Promise.all([
        Wallet.getDefaultType(),
        Wallet.getTypes(),
        Wallet.getDefaultCurrency(),
        Wallet.getCurrencies(),
      ]);

      return Response.data({
        defaultType,
        availableTypes,
        defaultCurrency,
        availableCurrencies,
      });
    };
  }

  @Get("/transfer/sign/:type?/:currency?/")
  public signTransfer(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        method: e
          .optional(e.in(Object.values(IdentificationMethod)))
          .describe("Provide a 3D security method to verify the transfer."),
        receiver: e.string(),
        amount: e.number({ cast: true }),
        description: e.optional(e.string().max(300)),
        metadata: e.optional(
          e.record(e.or([e.number(), e.boolean(), e.string()]), { cast: true }),
        ),
      },
      { allowUnexpectedProps: true },
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    });

    return new Versioned().add("1.0.0", {
      postman: {
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

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const [receiverId, accountId] = Query.receiver.split(":");

        const ReceivingUser = await UserModel.findOne({
          $or: [
            ...(ObjectId.isValid(receiverId)
              ? [{ _id: new ObjectId(receiverId) }]
              : []),
            { username: receiverId },
            { email: receiverId },
            { phone: receiverId },
          ],
        }).project({
          _id: 1,
          fname: 1,
          mname: 1,
          lname: 1,
          avatar: 1,
        });

        if (!ReceivingUser) {
          throw e.error(
            `Receiving user not found!`,
            `${route.scope}.query.receiver`,
          );
        }

        const ReceiverAccount = await AccountModel.findOne({
          ...(ObjectId.isValid(accountId)
            ? { _id: new ObjectId(accountId) }
            : {}),
          createdFor: ReceivingUser._id,
        }).project({
          name: 1,
          logo: 1,
          isBlocked: 1,
        });

        if (!ReceiverAccount) throw e.error("Receiver account not found!");
        if (ReceiverAccount.isBlocked) {
          throw e.error("Receiver account is not available!");
        }

        const TransferDetails = {
          sender: {
            accountId: ctx.router.state.auth.accountId,
            userId: ctx.router.state.auth.user._id,
            fname: ctx.router.state.auth.user.fname,
            mname: ctx.router.state.auth.user.mname,
            lname: ctx.router.state.auth.user.lname,
            avatar: ctx.router.state.auth.user.avatar,
          },
          receiver: {
            accountId: ReceiverAccount._id,
            accountName: ReceiverAccount.name,
            accountLogo: ReceiverAccount.logo,
            userId: ReceivingUser._id,
            fname: ReceivingUser.fname,
            mname: ReceivingUser.mname,
            lname: ReceivingUser.lname,
            avatar: ReceivingUser.avatar,
          },
          transactionDetails: {
            type: Params.type,
            currency: Params.currency,
            amount: Query.amount,
            fee: 0,
            description: Query.description,
            metadata: Query.metadata,
          },
        };

        if (Query.method) {
          const Challenge = await UsersIdentificationController.request(
            IdentificationPurpose.VERIFICATION,
            Query.method,
            { userId: ctx.router.state.auth.userId },
            TransferDetails,
          );

          return Response.statusCode(Status.Created).data({
            ...TransferDetails,
            challenge: {
              token: Challenge.token,

              // Return OTP if its a test.
              otp: Env.is(EnvType.TEST) ? Challenge.otp : undefined,
            },
          });
        }

        const Challenge = await UsersIdentificationController.sign(
          IdentificationPurpose.VERIFICATION,
          null,
          TransferDetails,
        );

        return Response.statusCode(Status.Created).data({
          ...TransferDetails,
          challenge: Challenge,
        });
      },
    });
  }

  @Post("/transfer/")
  public transfer(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      method: e.optional(e.in(Object.values(IdentificationMethod))),
      token: e.string(),
      code: e.number({ cast: true }).length(6),
    });

    return new Versioned().add("1.0.0", {
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

        type TransferEntity = {
          accountId: string;
          userId: string;
          fname: string;
          mname: string;
          lname: string;
          avatar: TFileOutput;
        };

        const Payload = await UsersIdentificationController.verify<{
          sender: TransferEntity;
          receiver: TransferEntity;
          transactionDetails: {
            type: string;
            currency: string;
            amount: number;
            fee: number;
            description: string;
            metadata?: Record<string, string | number | boolean>;
          };
        }>(Body.token, Body.code, IdentificationPurpose.VERIFICATION).catch(
          e.error,
        );

        const Transfer = await Wallet.transfer({
          sessionId: Payload.challengeId,
          fromName: [
            Payload.sender.fname,
            Payload.sender.mname,
            Payload.sender.lname,
          ],
          from: Payload.sender.accountId,
          sender: Payload.sender.userId,
          toName: [
            Payload.receiver.fname,
            Payload.receiver.mname,
            Payload.receiver.lname,
          ],
          to: Payload.receiver.accountId,
          receiver: Payload.receiver.userId,
          user: ctx.router.state.auth.userId,
          type: Payload.transactionDetails.type,
          currency: Payload.transactionDetails.currency,
          amount: Payload.transactionDetails.amount,
          description: Payload.transactionDetails.description,
          methodOf3DSecurity: Body.method,
          metadata: Payload.transactionDetails.metadata,
        });

        return Response.statusCode(Status.Created).data({
          transaction: Transfer.transaction,
        });
      },
    });
  }

  @Get("/balance/:type?/:currency?/")
  public balance(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        return Response.data(
          await Wallet.get(ctx.router.state.auth.accountId, Params),
        );
      },
    });
  }

  @Post("/balance/list/")
  public balanceList(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      types: e.optional(e.array(e.string())),
      currencies: e.optional(e.array(e.string())),
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
          await Wallet.list(ctx.router.state.auth.accountId, Body),
        );
      },
    });
  }

  @Get("/transactions/:type?/:currency?/")
  public transactions(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.object(
      {
        search: e.optional(e.string()),
        range: e.optional(
          e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true }),
        ),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        sort: e
          .optional(
            e.record(e.number({ cast: true }).min(-1).max(1), { cast: true }),
          )
          .default({ _id: -1 }),
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
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.optional(e.string()).default(() => Wallet.getDefaultType()),
      currency: e
        .optional(e.string())
        .default(() => Wallet.getDefaultCurrency()),
    });

    return Versioned.add("1.0.0", {
      postman: {
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

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const TargetAccountId = new ObjectId(ctx.router.state.auth.accountId);

        const TransactionListBaseConditions = {
          $or: [
            { from: TargetAccountId },
            { to: TargetAccountId },
          ],
          ...Params,
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
          .skip(Query.offset)
          .limit(Query.limit)
          .sort(Query.sort);

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
}
