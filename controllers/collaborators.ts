import {
  Controller,
  BaseController,
  Get,
  Post,
  Patch,
  Delete,
  Versioned,
  Response,
  type IRoute,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { Database } from "@Database";

import { AccountInviteModel } from "@Models/accountInvite.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { UserModel } from "@Models/user.ts";

@Controller("/collaborators/", { name: "collaborators" })
export default class CollaboratorsController extends BaseController {
  @Post("/:token/")
  public create(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      token: e.string(),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
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
            ctx.router.state.auth.user.username,
            ctx.router.state.auth.user.email,
            ctx.router.state.auth.user.phone,
          ].includes(Invite.recipient)
        )
          throw e.error("Invalid or expired invitation token!");

        if (ctx.router.state.auth!.userId === Invite.createdBy.toString())
          throw e.error("You cannot consume an invite token by yourself!");

        const CreatedFor = new ObjectId(ctx.router.state.auth!.userId);

        if (
          await CollaboratorModel.exists({
            account: Invite.account,
            createdFor: CreatedFor,
          })
        )
          throw e.error("You already have access to this account!");

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
              { session }
            );

            await UserModel.updateOne(
              ctx.router.state.auth!.userId,
              {
                $push: {
                  collaborates: Collaborator._id,
                },
              },
              { session }
            );

            return Collaborator;
          })
        );
      },
    });
  }

  @Patch("/:id/")
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
      postman: {
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        await CollaboratorModel.updateOneOrFail(
          {
            _id: new ObjectId(Params.id),
            account: new ObjectId(ctx.router.state.auth.accountId),
          },
          Body
        );

        return Response.true();
      },
    });
  }

  @Patch("/toggle/block/:id/")
  public toggleBlock(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        await CollaboratorModel.updateOneOrFail(
          {
            _id: new ObjectId(Params.id),
            account: new ObjectId(ctx.router.state.auth.accountId),
          },
          {
            isBlocked: { $not: "$isBlocked" },
          }
        );

        return Response.true();
      },
    });
  }

  @Get("/:id?/")
  public get(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.object(
      {
        search: e.optional(e.string()),
        range: e.optional(
          e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true })
        ),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        sort: e
          .optional(
            e.record(e.number({ cast: true }).min(-1).max(1), { cast: true })
          )
          .default({ _id: -1 }),
        project: e.optional(
          e.record(e.number({ cast: true }).min(0).max(1), { cast: true })
        ),
        includeTotalCount: e.optional(
          e
            .boolean({ cast: true })
            .describe(
              "If `true` is passed, the system will return a total items count for pagination purpose."
            )
        ),
      },
      { allowUnexpectedProps: true }
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
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

        /**
         * It is recommended to keep the following validators in place even if you don't want to validate any data.
         * It will prevent the client from injecting unexpected data into the request.
         *
         * */

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const CollaboratorsListQuery = CollaboratorModel.search(Query.search)
          .filter({
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
          .skip(Query.offset)
          .limit(Query.limit)
          .sort(Query.sort)
          .populateOne("createdFor", UserModel, {
            project: {
              fname: 1,
              mname: 1,
              lname: 1,
              avatar: 1,
            },
          });

        if (Query.project) CollaboratorsListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            ? //? Make sure to pass any limiting conditions for count if needed.
              await CollaboratorModel.count({
                account: new ObjectId(ctx.router.state.auth.accountId),
              })
            : undefined,
          results: await CollaboratorsListQuery,
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
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const CollaboratorId = new ObjectId(Params.id);

        await Database.transaction(async (session) => {
          const { deletedCount } = await CollaboratorModel.deleteOne(
            {
              _id: CollaboratorId,
              account: new ObjectId(ctx.router.state.auth!.accountId),
              isPrimary: false,
            },
            { session }
          );

          if (deletedCount)
            await UserModel.updateOne(
              ctx.router.state.auth!.userId,
              {
                $pull: {
                  collaborates: CollaboratorId,
                },
              },
              { session }
            );
        });

        return Response.true();
      },
    });
  }
}