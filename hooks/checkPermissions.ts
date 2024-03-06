import {
  Env,
  EnvType,
  type IRequestContext,
  Response,
  Store,
} from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { SecurityGuard } from "@Lib/securityGuard.ts";

import { OauthPolicyModel } from "@Models/oauthPolicy.ts";
import { UserModel } from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountModel } from "@Models/account.ts";

export const ResolveScopeRole = async (role: string) => {
  if (!role) throw new Error("Role not provided!");

  const OauthScopes = await OauthPolicyModel.findOne({
    role,
  }).project({ scopes: 1 });

  if (!OauthScopes) {
    throw e.error(
      `Unable to fetch the available scopes for the role '${role}'!`,
    );
  }

  return OauthScopes.scopes;
};

export const SessionValidator = e.optional(
  e.object({
    claims: e.object(
      {
        sessionId: e.string(),
        version: e.number(),
        refreshable: e.optional(e.boolean()),
        scopes: e.optional(e.array(e.string())),
      },
      { allowUnexpectedProps: true },
    ),
    session: e.any().custom((ctx) =>
      e
        .object(
          {
            scopes: e.record(e.array(e.string())),
            createdBy: e.string({ cast: true }),
          },
          { allowUnexpectedProps: true },
        )
        .validate(ctx.output)
    ),
  }),
);

export default {
  pre: async (
    scope: string,
    name: string,
    ctx: IRequestContext<RouterContext<string>>,
  ) => {
    const SessionInfo = await SessionValidator.validate(
      ctx.router.state.sessionInfo,
      {
        name: `${scope}.state.sessionInfo`,
      },
    );

    if (SessionInfo) {
      const AccountId = await e
        .instanceOf(ObjectId, { instantiate: true })
        .validate(
          ctx.router.request.headers.get("X-Account-ID") ??
            Object.keys(SessionInfo.session.scopes)[0],
          { name: `${scope}.headers.x-account-id` },
        );

      const { auth, scopePipeline } = await Store.cache(
        `checkPermissions:${SessionInfo.claims.sessionId}:${AccountId}`,
        async () => {
          const UserId = new ObjectId(SessionInfo.session.createdBy);

          const User = await UserModel.findOne(
            UserId,
          ).project({
            password: 0,
            passwordHistory: 0,
            collaborates: 0,
          });

          if (!User || User.isBlocked) {
            throw Response.statusCode(Status.Unauthorized)
              .message(
                "Authorized user not found or is blocked!",
              );
          }

          const Collaborator = await CollaboratorModel.findOne({
            account: AccountId,
            createdFor: UserId,
          })
            .project({
              createdBy: 1,
              role: 1,
              isOwned: 1,
              isPrimary: 1,
              isBlocked: 1,
            });

          if (!Collaborator || Collaborator.isBlocked) {
            throw Response.statusCode(Status.Unauthorized)
              .message(
                "You don't have access to this account or it is blocked!",
              );
          }

          const Account = await AccountModel.findOne(AccountId);

          if (!Account || Account.isBlocked) {
            throw Response.statusCode(Status.Unauthorized)
              .message(
                "Account not found or is blocked!",
              );
          }

          let GlobalRole = User.role;

          if (!GlobalRole) {
            throw Response.statusCode(Status.Unauthorized)
              .message(
                "You don't have a role assigned!",
              );
          }

          if (Collaborator.createdBy !== User._id) {
            const ParentUser =
              (await UserModel.findOne(Collaborator.createdBy).project({
                role: 1,
              })) ?? User;

            GlobalRole = ParentUser.role;
          }

          return {
            auth: {
              sessionId: SessionInfo.claims.sessionId,
              userId: SessionInfo.session.createdBy,
              accountId: AccountId.toString(),
              isAccountOwned: Collaborator.isOwned,
              isAccountPrimary: Collaborator.isPrimary,
              role: GlobalRole,
              accountRole: Collaborator.role,
              resolvedRole: Collaborator.role === "root"
                ? GlobalRole
                : Collaborator.role,
              user: User,
              account: Account,
            },
            scopePipeline: {
              all: [`role:${GlobalRole}`],
              available: [`role:${Collaborator.role}`],
              requested: SessionInfo.session.scopes[AccountId.toString()] ??
                [],
              permitted: SessionInfo.claims.scopes ?? ["*"],
            },
          };
        },
        60 * 1000, // 1m cache
      );

      ctx.router.state.auth = auth;
      ctx.router.state.scopePipeline = scopePipeline;
    }

    ctx.router.state.scopePipeline ??= {
      all: ["role:unauthenticated"],
      available: ["*"],
      requested: ["*"],
      permitted: ["*"],
    };

    const Guard = (ctx.router.state.guard = new SecurityGuard())
      .addStage(ctx.router.state.scopePipeline.all)
      .addStage(ctx.router.state.scopePipeline.available)
      .addStage(ctx.router.state.scopePipeline.requested)
      .addStage(ctx.router.state.scopePipeline.permitted);

    await Guard.parse({
      resolveScopeRole: ResolveScopeRole,
    });

    if (!Guard.isPermitted(scope, name)) {
      const ErrorResponse = Response.statusCode(Status.Unauthorized)
        .message(
          `You are not permitted! Missing permission '${`${scope}.${name}`}'.`,
        );

      if (!Env.is(EnvType.PRODUCTION)) {
        ErrorResponse.data(Guard);
      }

      throw ErrorResponse;
    }
  },
};
