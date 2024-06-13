import {
  BaseController,
  Controller,
  Delete,
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

import { Notify } from "@Lib/notify.ts";
import { AccountInviteModel } from "@Models/accountInvite.ts";
import { EmailValidator, PhoneValidator } from "@Models/user.ts";

export const InputAccountInviteSchema = e.object({
  recipient: e.string(),
  role: e.string(),
});

@Controller("/account/invites/", { name: "accountInvites" })
export default class AccountInvitesController extends BaseController {
  @Post("/")
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputAccountInviteSchema;

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

        if (
          [
            ctx.router.state.auth.user.username,
            ctx.router.state.auth.user.email,
            ctx.router.state.auth.user.phone,
          ].includes(Body.recipient)
        ) {
          throw e.error("You cannot invite yourself!");
        }

        const Token = crypto.randomUUID();

        if (!Env.is(EnvType.TEST)) {
          const [isEmail, isPhone] = await Promise.all([
            e.is(EmailValidator, Body.recipient),
            e.is(PhoneValidator, Body.recipient),
          ]);

          await Notify.sendWithNovu({
            userFilter: {
              $or: [
                { username: Body.recipient },
                { email: Body.recipient },
                { phone: Body.recipient },
              ],
            },
            email: isEmail ? Body.recipient : undefined,
            phone: isPhone ? Body.recipient : undefined,
            template: "account-invitation-token",
            payload: {
              sender: [
                ctx.router.state.auth.user.fname,
                ctx.router.state.auth.user.mname,
                ctx.router.state.auth.user.lname,
              ]
                .filter(Boolean)
                .join(" "),
              role: Body.role,
              token: Token,
            },
          });
        }

        const Invite = await AccountInviteModel.create({
          ...Body,
          token: Token,
          createdBy: ctx.router.state.auth.userId,
          account: ctx.router.state.auth.accountId,
        });

        return Response.statusCode(Status.Created).data(Invite);
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

        /**
         * It is recommended to keep the following validators in place even if you don't want to validate any data.
         * It will prevent the client from injecting unexpected data into the request.
         */

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        const AccountInvitesListQuery = AccountInviteModel.search(Query.search)
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
          .sort(Query.sort);

        if (Query.project) AccountInvitesListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await AccountInviteModel.count({
              account: new ObjectId(ctx.router.state.auth.accountId),
            })
            : undefined,
          results: await AccountInvitesListQuery,
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

        await AccountInviteModel.deleteOne({
          _id: new ObjectId(Params.id),
          account: new ObjectId(ctx.router.state.auth.accountId),
        });

        return Response.true();
      },
    });
  }
}
