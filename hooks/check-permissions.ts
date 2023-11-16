import { type IRequestContext } from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import { ObjectId } from "mongo";

import { CollaboratorModel } from "@Models/collaborator.ts";
import { OauthPolicyModel } from "@Models/oauth-policy.ts";
import { UserModel } from "@Models/user.ts";

import { SecurityGuard } from "@Lib/security-guard.ts";

export default {
  pre: async (
    scope: string,
    name: string,
    ctx: IRequestContext<RouterContext<string>>
  ) => {
    const SessionInfo = await e
      .optional(
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
      )
      .validate(ctx.router.state.sessionInfo, {
        name: `${scope}.state.sessionInfo`,
      });

    let AvailableScopes: string[] = [];
    let RequestedScopes: string[] = [];
    let PermittedScopes: string[] = [];

    if (SessionInfo) {
      const AccountId = await e
        .string()
        .length({ min: 1 })
        .validate(
          ctx.router.request.headers.get("X-Account-ID") ??
            Object.keys(SessionInfo.session.scopes)[0],
          { name: `${scope}.headers.x-account-id` }
        );

      const Collaborator = await CollaboratorModel.findOne({
        account: new ObjectId(AccountId),
        createdFor: new ObjectId(SessionInfo.session.createdBy),
      }).project({ role: 1 });

      if (!Collaborator) e.error("You don't have access to this account!");

      const OauthScopes = await OauthPolicyModel.findOne({
        role: Collaborator!.role,
      }).project({ scopes: 1 });

      if (!OauthScopes)
        throw e.error(
          `Unable to fetch the available scopes for the role '${
            Collaborator!.role
          }'!`
        );

      const User = await UserModel.findOne(
        SessionInfo.session.createdBy
      ).project({
        password: 0,
        passwordHistory: 0,
        collaborates: 0,
      });

      if (!User) throw e.error(`Authorized user not found!`);

      ctx.router.state.auth = {
        sessionId: SessionInfo.claims.sessionId,
        userId: SessionInfo.session.createdBy,
        accountId: AccountId,
        role: Collaborator!.role,
        user: User,
      };

      AvailableScopes = OauthScopes?.scopes ?? [];
      RequestedScopes = SessionInfo.session.scopes[AccountId] ?? [];
      PermittedScopes = SessionInfo.claims.scopes ?? ["*"];
    } else {
      const UnauthenticatedRole = "unauthenticated";
      const OauthScopes = await OauthPolicyModel.findOne({
        role: UnauthenticatedRole,
      }).project({ scopes: 1 });

      if (!OauthScopes)
        e.error(
          `Unable to fetch the available scopes for the role '${UnauthenticatedRole}'!`
        );

      AvailableScopes = OauthScopes?.scopes ?? [];
      RequestedScopes = ["*"];
      PermittedScopes = ["*"];
    }

    const NormalizedAvailableScopes = await AvailableScopes.reduce(
      async (scopes, scope) => {
        const Scopes = await scopes;
        const Match = scope.match(/^role:(.*)/);

        if (Match) {
          const OauthScopes = await OauthPolicyModel.findOne({
            role: Match[1],
          }).project({ scopes: 1 });

          if (!OauthScopes)
            e.error(
              `Unable to fetch the available scopes for the role '${Match[1]}'!`
            );

          return [...Scopes, ...(OauthScopes?.scopes ?? [])];
        }

        return [...Scopes, scope];
      },
      Promise.resolve<string[]>([])
    );

    const Guard = (ctx.router.state.guard = new SecurityGuard(
      NormalizedAvailableScopes,
      RequestedScopes,
      PermittedScopes
    ));

    if (!Guard.isPermitted(scope, name))
      ctx.router.throw(
        Status.Unauthorized,
        `You are not permitted! Missing permission '${`${scope}.${name}`}'.`
      );
  },
};
