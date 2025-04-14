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
import { responseValidator } from "@Core/common/validators.ts";
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
import { FileSchema, TFileOutput } from "@Models/file.ts";
import { WalletModel } from "@Models/wallet.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";

@Controller("/wallet/", { group: "Wallet", name: "wallet" })
export default class WalletController extends BaseController {
  @Get("/metadata/", {
    group: "public",
  })
  public metadata() {
    return new Versioned().add("1.0.0", {
      shape: () => ({
        return: responseValidator(e.object({
          defaultType: e.string(),
          availableTypes: e.array(e.string()),
          defaultCurrency: e.string(),
          availableCurrencies: e.array(e.string()),
        })).toSample(),
      }),
      handler: async () => {
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
      },
    });
  }

  @Get("/transfer/sign/:type?/:currency?/", {
    group: "public",
  })
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
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          sender: e.object({
            accountId: e.string(),
            userId: e.string(),
            fname: e.string(),
            mname: e.string(),
            lname: e.string(),
            avatar: e.string(),
          }),
          receiver: e.object({
            accountId: e.string(),
            accountName: e.string(),
            accountLogo: FileSchema,
            userId: e.string(),
            fname: e.string(),
            mname: e.string(),
            lname: e.string(),
            avatar: e.string(),
          }),
          transactionDetails: e.object({
            type: e.string(),
            currency: e.string(),
            amount: e.number(),
            fee: e.number(),
            description: e.string(),
            metadata: e.record(e.or([e.string(), e.number(), e.boolean()])),
          }),
          challenge: e.object({
            token: e.string(),
            otp: e.optional(e.number()),
          }),
        })).toSample(),
      }),
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
            { reference: receiverId },
          ],
        }).project({
          _id: 1,
          fname: 1,
          mname: 1,
          lname: 1,
          avatar: 1,
        });

        if (!ReceivingUser?._id) {
          throw e.error(
            `Receiving user not found!`,
            `${route.scope}.query.receiver`,
          );
        }

        const Collaborations = await CollaboratorModel.find({
          createdFor: ReceivingUser._id,
          ...(ObjectId.isValid(accountId)
            ? { account: new ObjectId(accountId) }
            : {}),
          isBlocked: { $ne: true },
        }).project({ account: 1 });

        if (!Collaborations.length) {
          throw new Error("No relevant account found!");
        }

        const ReceiverAccount = await AccountModel.findOne({
          _id: { $in: Collaborations.map(($) => $.account) },
          isBlocked: { $ne: true },
        }).project({ name: 1, logo: 1 });

        if (!ReceiverAccount) throw new Error("Receiver account not found!");

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

  @Post("/transfer/", {
    group: "public",
  })
  public transfer(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      method: e.optional(e.in(Object.values(IdentificationMethod))),
      token: e.string(),
      code: e.number({ cast: true }).length(6),
      tags: e.optional(e.array(e.string())),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(e.object({
          transaction: TransactionModel.getSchema(),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
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
          tags: Body.tags,
          metadata: Payload.transactionDetails.metadata,
        });

        return Response.statusCode(Status.Created).data({
          transaction: Transfer.transaction,
        });
      },
    });
  }

  @Get("/balance/:type?/:currency?/", {
    group: "public",
  })
  public balance(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      type: e.optional(e.string()),
      currency: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator(e.omit(WalletModel.getSchema(), ["digest"]))
          .toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const wallet = await Wallet.get(
          ctx.router.state.auth.accountId,
          Params,
        );

        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        delete wallet.digest;

        return Response.data(wallet);
      },
    });
  }

  @Post("/balance/list/", {
    group: "public",
  })
  public balanceList(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      types: e.optional(e.array(e.string())),
      currencies: e.optional(e.array(e.string())),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(
          e.array(e.omit(WalletModel.getSchema(), ["digest"])),
        ).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const walletList = await Wallet.list(
          ctx.router.state.auth.accountId,
          Body,
        );

        return Response.data(walletList.map((wallet) => {
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          delete wallet.digest;

          return wallet;
        }));
      },
    });
  }

  @Get("/transactions/:type?/:currency?/", {
    group: "public",
  })
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
      type: e.optional(e.string()).default(() => Wallet.getDefaultType()),
      currency: e
        .optional(e.string())
        .default(() => Wallet.getDefaultCurrency()),
    });

    const LimitedAccount = e.pick(AccountModel.getSchema(), ["name", "logo"]);
    const LimitedUser = e.pick(UserModel.getSchema(), [
      "fname",
      "mname",
      "lname",
      "avatar",
    ]);

    return Versioned.add("1.0.0", {
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(
            e.object({
              from: LimitedAccount,
              to: LimitedAccount,
              sender: LimitedUser,
              receiver: LimitedUser,
            }).extends(
              e.omit(TransactionModel.getSchema(), [
                "sender",
                "receiver",
                "from",
                "to",
              ]),
            ),
          ),
        })).toSample(),
      }),
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
          .sort(Query.sort)
          .skip(Query.offset)
          .limit(Query.limit)
          .populateOne("from", AccountModel, { project: { name: 1, logo: 1 } })
          .populateOne("sender", UserModel, {
            project: { fname: 1, mname: 1, lname: 1, avatar: 1 },
          })
          .populateOne("to", AccountModel, { project: { name: 1, logo: 1 } })
          .populateOne("receiver", UserModel, {
            project: { fname: 1, mname: 1, lname: 1, avatar: 1 },
          });

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
