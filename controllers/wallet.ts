// deno-lint-ignore-file no-explicit-any
import {
  Controller,
  BaseController,
  Get,
  Post,
  Versioned,
  Response,
  type IRoute,
  type IRequestContext,
  Env,
  EnvType,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import { UserModel } from "@Models/user.ts";
import { Wallet } from "@Lib/wallet.ts";
import { TransactionModel } from "@Models/transaction.ts";
import UsersIdentificationController, {
  IdentificationMethod,
  IdentificationPurpose,
} from "@Controllers/usersIdentification.ts";
import { AccountModel } from "@Models/account.ts";
import { IFile } from "@Models/file.ts";

@Controller("/wallet/", { name: "wallet" })
export default class WalletController extends BaseController {
  @Get("/transfer/sign/:type?/:currency?/")
  public signTransfer(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        method: e.optional(e.in(Object.values(IdentificationMethod))),
        receiver: e.string(),
        amount: e.number({ cast: true }),
        description: e.optional(e.string().max(300)),
      },
      { allowUnexpectedProps: true }
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
          { name: `${route.scope}.query` }
        );

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const ReceivingUser = await UserModel.findOne(
          {
            $or: [
              { username: Query.receiver },
              { email: Query.receiver },
              { phone: Query.receiver },
            ],
          },
          {
            _id: 1,
            fname: 1,
            mname: 1,
            lname: 1,
            avatar: 1,
          }
        );

        if (!ReceivingUser)
          throw e.error(
            `Receiving user not found!`,
            `${route.scope}.query.receiver`
          );

        const SendingUser = await UserModel.findOne(
          { _id: ctx.router.state.auth.userId },
          {
            _id: 1,
            fname: 1,
            mname: 1,
            lname: 1,
            avatar: 1,
          }
        );

        if (!SendingUser) throw e.error("User not found!");

        const TransferDetails = {
          sender: SendingUser,
          receiver: ReceivingUser,
          transactionDetails: {
            type: Params.type,
            currency: Params.currency,
            amount: Query.amount,
            fee: 0,
            description: Query.description,
          },
        };

        if (Query.method) {
          const Challenge = await UsersIdentificationController.request(
            IdentificationPurpose.VERIFICATION,
            Query.method,
            { userId: ctx.router.state.auth.userId },
            TransferDetails
          );

          return Response.statusCode(Status.Created).data({
            ...TransferDetails,
            challenge: {
              token: Challenge.token,
              otp: Env.is(EnvType.TEST) ? Challenge.otp : undefined,
            },
          });
        }

        const Challenge = await UsersIdentificationController.sign(
          IdentificationPurpose.VERIFICATION,
          null,
          TransferDetails
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
          { name: `${route.scope}.body` }
        );

        type TransferEntity = {
          _id: string;
          fname: string;
          mname: string;
          lname: string;
          avatar: IFile;
        };

        const Payload = await UsersIdentificationController.verify<{
          sender: TransferEntity;
          receiver: TransferEntity;
          transactionDetails: {
            type: string;
            currency: string;
            amount: number;
            fee: number; //! Do not use this fee as it is not authentic! Possible Reasons: (Fee change, Account Change after signTransfer etc.)
            description: string;
          };
        }>(Body.token, Body.code, IdentificationPurpose.VERIFICATION).catch(
          e.error
        );

        if (ctx.router.state.auth.userId !== Payload.sender._id)
          throw e.error("Invalid transfer request!");

        const ReceiverAccount = await AccountModel.findOne(
          { createdFor: Payload.receiver._id },
          {
            _id: 1,
            isBlocked: 1,
          }
        );

        if (!ReceiverAccount) throw e.error("Receiver account not found!");
        if (ReceiverAccount.isBlocked)
          throw e.error("Receiver account is not available!");

        return Response.statusCode(Status.Created).data({
          transaction: (
            await Wallet.transfer({
              sessionId: Payload.challengeId,
              fromName: [
                Payload.sender.fname,
                Payload.sender.mname,
                Payload.sender.lname,
              ]
                .filter(Boolean)
                .join(" "),
              from: ctx.router.state.auth.accountId,
              toName: [
                Payload.receiver.fname,
                Payload.receiver.mname,
                Payload.receiver.lname,
              ]
                .filter(Boolean)
                .join(" "),
              to: ReceiverAccount,
              user: ctx.router.state.auth.userId,
              type: Payload.transactionDetails.type,
              currency: Payload.transactionDetails.currency,
              amount: Payload.transactionDetails.amount,
              description: Payload.transactionDetails.description,
              is3DVerified: [
                IdentificationMethod.EMAIL,
                IdentificationMethod.PHONE,
              ].includes(Body.method ?? ""),
            })
          ).transaction,
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
          await Wallet.get(ctx.router.state.auth.accountId, Params)
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
        range: e
          .optional(
            e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true })
          )
          .default([Date.now() - 86400000 * 7, Date.now()]),
        sort: e
          .optional(
            e.record(e.number({ cast: true }).min(-1).max(1), { cast: true })
          )
          .default({ _id: -1 }),
      },
      { allowUnexpectedProps: true }
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
          { name: `${route.scope}.query` }
        );

        if (Query.range[1] <= Query.range[0])
          throw e.error(`Please provide a valid date range!`);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        return Response.data({
          results: await TransactionModel.find({
            ...(Query.search
              ? {
                  $text: {
                    $search: Query.search,
                  },
                }
              : {}),
            $or: [
              { from: ctx.router.state.auth.accountId },
              { to: ctx.router.state.auth.accountId },
            ],
            ...Params,
            createdAt: {
              $gt: Query.range[0],
              $lt: Query.range[1],
            },
          }).sort(Query.sort as any),
        });
      },
    });
  }
}
