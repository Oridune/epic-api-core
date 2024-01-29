import {
  Env,
  EnvType,
  type IRequestContext,
  Response,
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

  if (!OauthScopes)
    throw e.error(
      `Unable to fetch the available scopes for the role '${role}'!`
    );

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
      { allowUnexpectedProps: true }
    ),
    session: e.any().custom((ctx) =>
      e
        .object(
          {
            scopes: e.record(e.array(e.string())),
            createdBy: e.string({ cast: true }),
          },
          { allowUnexpectedProps: true }
        )
        .validate(ctx.output)
    ),
  })
);

export default {
  pre: async (
    scope: string,
    name: string,
    ctx: IRequestContext<RouterContext<string>>
  ) => {
    const SessionInfo = await SessionValidator.validate(
      ctx.router.state.sessionInfo,
      {
        name: `${scope}.state.sessionInfo`,
      }
    );

    let AllScopes: string[];
    let AvailableScopes: string[];
    let RequestedScopes: string[];
    let PermittedScopes: string[];

    if (SessionInfo) {
      const AccountId = await e
        .instanceOf(ObjectId, { instantiate: true })
        .validate(
          ctx.router.request.headers.get("X-Account-ID") ??
            Object.keys(SessionInfo.session.scopes)[0],
          { name: `${scope}.headers.x-account-id` }
        );

      const User = await UserModel.findOne(
        SessionInfo.session.createdBy
      ).project({
        password: 0,
        passwordHistory: 0,
        collaborates: 0,
      });

      if (!User) throw e.error(`Authorized user not found!`);

      const Collaborator = await CollaboratorModel.findOne({
        account: AccountId,
        createdFor: new ObjectId(SessionInfo.session.createdBy),
      }).project({
        createdBy: 1,
        role: 1,
        isOwned: 1,
        isPrimary: 1,
        isBlocked: 1,
      });

      if (!Collaborator)
        ctx.router.throw(
          Status.Unauthorized,
          "You don't have access to this account!"
        );

      if (Collaborator.isBlocked)
        ctx.router.throw(
          Status.Unauthorized,
          "Your access to this account has been blocked!"
        );

      if (await AccountModel.exists({ _id: AccountId, isBlocked: true }))
        ctx.router.throw(Status.Unauthorized, "Account is blocked!");

      let GlobalRole = User.role;

      if (!GlobalRole)
        ctx.router.throw(
          Status.Unauthorized,
          "You don't have a role assigned!"
        );

      if (Collaborator.createdBy !== User._id) {
        const ParentUser =
          (await UserModel.findOne(Collaborator.createdBy).project({
            role: 1,
          })) ?? User;

        GlobalRole = ParentUser.role;
      }

      ctx.router.state.auth = {
        sessionId: SessionInfo.claims.sessionId,
        userId: SessionInfo.session.createdBy,
        accountId: AccountId.toString(),
        isAccountOwned: Collaborator.isOwned,
        isAccountPrimary: Collaborator.isPrimary,
        role: GlobalRole,
        accountRole: Collaborator.role,
        resolvedRole:
          Collaborator.role === "root" ? GlobalRole : Collaborator.role,
        user: User,
      };

      AllScopes = [`role:${GlobalRole}`];
      AvailableScopes = [`role:${Collaborator.role}`];
      RequestedScopes = SessionInfo.session.scopes[AccountId.toString()] ?? [];
      PermittedScopes = SessionInfo.claims.scopes ?? ["*"];
    } else {
      AllScopes = ["role:unauthenticated"];
      AvailableScopes = ["*"];
      RequestedScopes = ["*"];
      PermittedScopes = ["*"];
    }

    const Guard = (ctx.router.state.guard = new SecurityGuard())
      .addStage(AllScopes)
      .addStage(AvailableScopes)
      .addStage(RequestedScopes)
      .addStage(PermittedScopes);

    await Guard.parse({
      resolveScopeRole: ResolveScopeRole,
    });

    if (!Guard.isPermitted(scope, name)) {
      const Message = `You are not permitted! Missing permission '${`${scope}.${name}`}'.`;

      if (Env.is(EnvType.PRODUCTION))
        ctx.router.throw(Status.Unauthorized, Message);

      throw Response.statusCode(Status.Unauthorized)
        .message(Message)
        .data(Guard);
    }
  },
};
