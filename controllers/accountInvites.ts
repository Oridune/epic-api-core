import {
  BaseController,
  Controller,
  Delete,
  Env,
  EnvType,
  Get,
  type IRequestContext,
  type IRoute,
  parseQueryParams,
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

import { AccountInviteModel } from "@Models/accountInvite.ts";
import { UserModel } from "@Models/user.ts";
import { getNotify } from "@Lib/notifications.ts";

export const InputAccountInviteSchema = e.object({
  recipient: e.string(),
  role: e.string(),
});

@Controller("/account/invites/", { group: "Account", name: "accountInvites" })
export default class AccountInvitesController extends BaseController {
  @Post("/", {
    group: "public",
  })
  public create(route: IRoute) {
    // Define Body Schema
    const BodySchema = InputAccountInviteSchema;

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(AccountInviteModel.getSchema()).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        if (
          [
            ctx.router.state.auth.user.username,
            ctx.router.state.auth.user.email,
            ctx.router.state.auth.user.phone,
          ].includes(Body.recipient)
        ) throw e.error("You cannot invite yourself!");

        const Token = crypto.randomUUID();

        if (!Env.is(EnvType.TEST)) {
          const invitedUser = await UserModel.findOne({
            $or: [
              { username: Body.recipient },
              { email: Body.recipient },
              { phone: Body.recipient },
            ],
          }).project({ _id: 1 });

          if (!invitedUser) throw new Error("Recipient not registered!");

          const metadata = {
            sender: [
              ctx.router.state.auth.user.fname,
              ctx.router.state.auth.user.mname,
              ctx.router.state.auth.user.lname,
            ]
              .filter(Boolean)
              .join(" "),
            role: Body.role,
            token: Token,
          };

          const notify = await getNotify();

          await notify.triggers.trigger({
            body: {
              recipient: {
                sseTarget: {
                  group: await Env.get("NOTIFY_APP_ID"),
                  reference: invitedUser._id.toString(),
                },
              },
              messages: [{
                channel: "sse",
                sse: {
                  title: "You have an invite!",
                  body: ctx.router.t(
                    "You have been invited by {{ sender }} to collaborate on his account with permissions: {{ role }}",
                    {
                      sender: metadata.sender,
                      role: metadata.role,
                    },
                  ),
                  metadata,
                },
              }],
            },
          }).raw;

          // await Notify.sendWithNovu({
          //   userFilter: {
          //     $or: [
          //       { username: Body.recipient },
          //       { email: Body.recipient },
          //       { phone: Body.recipient },
          //     ],
          //   },
          //   email: isEmail ? Body.recipient : undefined,
          //   phone: isPhone ? Body.recipient : undefined,
          //   template: "account-invitation-token",
          //   payload: {
          //     sender: [
          //       ctx.router.state.auth.user.fname,
          //       ctx.router.state.auth.user.mname,
          //       ctx.router.state.auth.user.lname,
          //     ]
          //       .filter(Boolean)
          //       .join(" "),
          //     role: Body.role,
          //     token: Token,
          //   },
          // });
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
          results: e.array(AccountInviteModel.getSchema()),
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

        const AccountInvitesListQuery = AccountInviteModel.search(Query.search)
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
          .limit(Query.limit);

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

        await AccountInviteModel.deleteOne({
          _id: new ObjectId(Params.id),
          account: new ObjectId(ctx.router.state.auth.accountId),
        });

        return Response.true();
      },
    });
  }
}
