import {
  Controller,
  BaseController,
  Get,
  Post,
  Patch,
  Put,
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

import UploadsController from "@Controllers/uploads.ts";
import { InputAccountSchema, AccountModel } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { UserModel } from "@Models/user.ts";

@Controller("/accounts/", { name: "accounts" })
export default class AccountsController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputAccountSchema();

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

        return Response.statusCode(Status.Created).data(
          await Database.transaction(async (session) => {
            const Account = await AccountModel.create(
              {
                createdBy: ctx.router.state.auth!.userId,
                createdFor: ctx.router.state.auth!.userId,
                ...Body,
              },
              { session }
            );

            const Collaborator = await CollaboratorModel.create(
              {
                createdBy: ctx.router.state.auth!.userId,
                createdFor: ctx.router.state.auth!.userId,
                account: Account._id,
                isOwned: true,
                isPrimary: false,
              },
              { session }
            );

            await UserModel.updateOne(ctx.router.state.auth!.userId, {
              $push: { collaborates: Collaborator._id },
            });

            return Account;
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
    const BodySchema = e.partial(InputAccountSchema);

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

        const TargetUser = new ObjectId(ctx.router.state.auth.userId);

        await AccountModel.updateOne(
          {
            _id: new ObjectId(Params.id),
            $or: [{ createdBy: TargetUser }, { createdFor: TargetUser }],
          },
          Body
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
            ? //? Make sure to pass any limiting conditions for count if needed.
              await AccountModel.count()
            : undefined,
          results: await AccountListQuery,
        });
      },
    });
  }

  @Delete("/:id/")
  public delete(_route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
    });

    return Versioned.add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: (_ctx: IRequestContext<RouterContext<string>>) => {
        throw e.error("Account deletion is not available yet!");

        // if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // // Params Validation
        // const Params = await ParamsSchema.validate(ctx.router.params, {
        //   name: `${route.scope}.params`,
        // });

        // const TargetUser = new ObjectId(ctx.router.state.auth.userId);

        // await AccountModel.deleteOne({
        //   _id: new ObjectId(Params.id),
        //   $or: [{ createdBy: TargetUser }, { createdFor: TargetUser }],
        // });

        // return Response.true();
      },
    });
  }

  @Get("/logo/:account/")
  @Put("/logo/")
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

        const TargetUser = ctx.router.state.auth!.userId;

        await AccountModel.updateOne(
          {
            _id: new ObjectId(metadata.account),
            $or: [{ createdBy: TargetUser }, { createdFor: TargetUser }],
          },
          { logo }
        );
      }
    );
  }
}
