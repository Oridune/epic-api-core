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
import e from "validator";
import { ObjectId } from "mongo";
import { Database } from "@Database";

import { AccountInviteModel } from "@Models/accountInvite.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { UserModel } from "@Models/user.ts";
import { OauthSessionModel } from "@Models/oauthSession.ts";
import { OauthSecretModel } from "@Models/oauthSecret.ts";
import { allowPopulate } from "@Helpers/utils.ts";

@Controller("/collaborators/", { group: "Account", name: "collaborators" })
export default class CollaboratorsController extends BaseController {
  @Post("/:token/")
  public create(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      token: e.string(),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        return: responseValidator(CollaboratorModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const Invite = await AccountInviteModel.findOne(Params);

        if (
          !Invite ||
          ![
            ctx.router.state.auth.user.email,
            ctx.router.state.auth.user.username,
            ctx.router.state.auth.user.phone,
          ]
            .filter(Boolean)
            .map(($) => $.toLowerCase())
            .includes(Invite.recipient.toLowerCase())
        ) throw e.error("Invalid or expired invitation token!");

        if (ctx.router.state.auth!.userId === Invite.createdBy.toString()) {
          throw e.error("You cannot consume an invite token by yourself!");
        }

        const CreatedFor = new ObjectId(ctx.router.state.auth!.userId);

        if (
          await CollaboratorModel.exists({
            account: Invite.account,
            createdFor: CreatedFor,
          })
        ) {
          throw e.error("You already have access to this account!");
        }

        return Response.statusCode(Status.Created).data(
          await Database.transaction(async (session) => {
            await AccountInviteModel.deleteOne(Invite._id, { session });

            const Collaborator = await CollaboratorModel.create(
              {
                createdBy: Invite.createdBy,
                createdFor: CreatedFor,
                account: Invite.account,
                role: Invite.role,
                isOwned: false,
                isPrimary: false,
              },
              { session },
            );

            await UserModel.updateOne(
              ctx.router.state.auth!.userId,
              {
                $push: {
                  collaborates: Collaborator._id,
                },
              },
              { session },
            );

            if (ctx.router.state.auth?.sessionId) {
              await OauthSessionModel.updateOneOrFail(
                ctx.router.state.auth.sessionId,
                {
                  [`scopes.${Invite.account.toString()}`]:
                    ctx.router.state.scopePipeline.requested,
                },
                { session },
              );
            }

            if (ctx.router.state.auth?.secretId) {
              await OauthSecretModel.updateOneOrFail(
                ctx.router.state.auth.secretId,
                {
                  [`scopes.${Invite.account.toString()}`]:
                    ctx.router.state.scopePipeline.requested,
                },
                { session },
              );
            }

            return Collaborator;
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
    const BodySchema = e.object({
      role: e.string(),
    });

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

        const CollaboratorId = new ObjectId(Params.id);
        const AccountId = new ObjectId(ctx.router.state.auth.accountId);
        const UserId = new ObjectId(ctx.router.state.auth.userId);

        // Either the account owner or the collaboration creator should be able to update
        await CollaboratorModel.updateOneOrFail(
          ctx.router.state.auth.isAccountOwned
            ? {
              _id: CollaboratorId,
              account: AccountId,
            }
            : {
              _id: CollaboratorId,
              account: AccountId,
              createdBy: UserId,
            },
          Body,
        );

        return Response.true();
      },
    });
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
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Either the account owner or the collaboration creator should be able to block
        await CollaboratorModel.updateOneOrFail(Params.id, {
          isBlocked: Params.isBlocked,
        });

        return Response.true();
      },
    });
  }

  @Get("/:id?/", {
    group: "public",
  })
  public get(route: IRoute) {
    // Define Query Schema
    const QuerySchema = queryValidator();

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
          results: e.array(CollaboratorModel.getSchema()),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

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

        const CollaboratorsListQuery = CollaboratorModel.search(Query.search)
          .filter({
            ...normalizeFilters(Query.filters),
            ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
            account: new ObjectId(ctx.router.state.auth.accountId),
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
          .limit(Query.limit)
          .populateOne("createdFor", UserModel, {
            project: {
              fname: 1,
              mname: 1,
              lname: 1,
              avatar: 1,
            },
            disabled: !allowPopulate(/^createdFor.*/, Query.project),
          });

        if (Query.project) CollaboratorsListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await CollaboratorModel.count({
              account: new ObjectId(ctx.router.state.auth.accountId),
            })
            : undefined,
          results: await CollaboratorsListQuery,
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

        const CollaboratorId = new ObjectId(Params.id);
        const AccountId = new ObjectId(ctx.router.state.auth.accountId);
        const UserId = new ObjectId(ctx.router.state.auth.userId);

        await Database.transaction(async (session) => {
          // Either the account owner or the collaboration creator should be able to delete
          await CollaboratorModel.deleteOneOrFail(
            ctx.router.state.auth!.isAccountOwned
              ? {
                _id: CollaboratorId,
                account: AccountId,
                isPrimary: false,
              }
              : {
                _id: CollaboratorId,
                account: AccountId,
                createdBy: UserId,
                isPrimary: false,
              },
            { session },
          );

          await UserModel.updateOne(
            ctx.router.state.auth!.userId,
            {
              $pull: {
                collaborates: CollaboratorId,
              },
            },
            { session },
          );
        });

        return Response.true();
      },
    });
  }
}
