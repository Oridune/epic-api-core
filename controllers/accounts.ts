import {
  BaseController,
  Controller,
  Delete,
  Env,
  Get,
  type IRequestContext,
  type IRoute,
  Patch,
  Post,
  Put,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { responseValidator } from "@Core/common/validators.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { Database } from "@Database";

import UploadsController from "@Controllers/uploads.ts";
import { AccountModel, InputAccountSchema } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { UserModel } from "@Models/user.ts";
import { PermanentlyDeleteAccount } from "@Jobs/deleteUsers.ts";
import { OauthSessionModel } from "@Models/oauthSession.ts";
import { OauthSecretModel } from "@Models/oauthSecret.ts";

@Controller("/accounts/", { group: "Account", name: "accounts" })
export default class AccountsController extends BaseController {
  @Post("/", {
    group: "public",
  })
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputAccountSchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(e.object({
          account: AccountModel.getSchema(),
          collaborator: CollaboratorModel.getSchema(),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const AccountCount = await AccountModel.count({
          createdFor: new ObjectId(ctx.router.state.auth!.userId),
        });

        const MaxAccountCount = parseInt(
          await Env.get("MAX_ACCOUNT_COUNT", true) ?? "1",
        );

        const UserMaxAccountCount = parseInt(
          (await Env.get("USER_MAX_ACCOUNT_COUNT", true) ?? "").split(",").map(
            (_) => _.split(":"),
          ).find((_) => _[0] === ctx.router.state.auth!.userId)?.[1] ??
            MaxAccountCount.toString(),
        );

        if (AccountCount >= UserMaxAccountCount) {
          throw new Error(`You have reached your account creation limit!`);
        }

        return Response.statusCode(Status.Created).data(
          await Database.transaction(async (session) => {
            const Account = await AccountModel.create(
              {
                createdBy: ctx.router.state.auth!.userId,
                createdFor: ctx.router.state.auth!.userId,
                ...Body,
              },
              { session },
            );

            const Collaborator = await CollaboratorModel.create(
              {
                createdBy: ctx.router.state.auth!.userId,
                createdFor: ctx.router.state.auth!.userId,
                account: Account._id,
                isOwned: true,
                isPrimary: false,
              },
              { session },
            );

            await UserModel.updateOneOrFail(ctx.router.state.auth!.userId, {
              $push: { collaborates: Collaborator._id },
            });

            if (ctx.router.state.auth?.sessionId) {
              await OauthSessionModel.updateOneOrFail(
                ctx.router.state.auth.sessionId,
                {
                  [`scopes.${Account._id.toString()}`]:
                    ctx.router.state.scopePipeline.requested,
                },
                { session },
              );
            }

            if (ctx.router.state.auth?.secretId) {
              await OauthSecretModel.updateOneOrFail(
                ctx.router.state.auth.secretId,
                {
                  [`scopes.${Account._id.toString()}`]:
                    ctx.router.state.scopePipeline.requested,
                },
                { session },
              );
            }

            return {
              account: Account,
              collaborator: Collaborator,
            };
          }),
        );
      },
    });
  }

  @Patch("/:id/", {
    group: "public",
  })
  public update(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    // Define Body Schema
    const BodySchema = e.partial(InputAccountSchema);

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
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

        const TargetUser = new ObjectId(ctx.router.state.auth.userId);

        await AccountModel.updateOneOrFail(
          {
            _id: new ObjectId(Params.id),
            $or: [{ createdBy: TargetUser }, { createdFor: TargetUser }],
          },
          Body,
        );

        return Response.true();
      },
    });
  }

  @Get("/:id?/", {
    group: "public",
  })
  public get(route: IRoute) {
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
      id: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      shape: () => ({
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        return: responseValidator(e.object({
          totalCount: e.optional(e.number()),
          results: e.array(AccountModel.getSchema()),
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

        const TargetUser = new ObjectId(ctx.router.state.auth.userId);

        const AccountListQuery = AccountModel.search(Query.search)
          .filter({
            ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
            $or: [{ createdBy: TargetUser }, { createdFor: TargetUser }],
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

        if (Query.project) AccountListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await AccountModel.count()
            : undefined,
          results: await AccountListQuery,
        });
      },
    });
  }

  @Delete("/:id/", {
    group: "public",
  })
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
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        if (ctx.router.state.auth.accountId === Params.id) {
          throw e.error(
            "Cannot delete the current account! Please switch to a different account first!",
          );
        }

        const UserId = new ObjectId(ctx.router.state.auth!.userId);
        const AccountId = new ObjectId(Params.id);

        await PermanentlyDeleteAccount.exec({
          userId: UserId,
          accountId: AccountId,
        });

        return Response.true();
      },
    });
  }

  @Get("/logo/:account/", {
    group: "public",
  })
  @Put("/logo/", {
    group: "public",
  })
  public updateLogo(route: IRoute) {
    return UploadsController.upload<{
      account: string;
    }>(
      route,
      {
        allowedContentTypes: [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/svg+xml",
          "image/webp",
        ],
        maxContentLength: 2e6,
        location: "accounts/{{account}}/avatar/",
      },
      async (ctx, logo, metadata) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        const UserId = new ObjectId(ctx.router.state.auth!.userId);
        const AccountId = new ObjectId(metadata.account);

        await AccountModel.updateOne(
          {
            _id: AccountId,
            $or: [{ createdBy: UserId }, { createdFor: UserId }],
          },
          { logo },
        );
      },
    );
  }

  @Patch("/toggle/blocked/:id/:isBlocked/")
  public toggleBlocked(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
      isBlocked: e.boolean({ cast: true }),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Update account's blocking status
        await AccountModel.updateOneOrFail(Params.id, {
          isBlocked: Params.isBlocked,
        });

        return Response.true();
      },
    });
  }
}
