import { type IRequestContext } from "@Core/common/mod.ts";
import { type RouterContext, createHttpError, Status } from "oak";
import e from "validator";

import { AccessModel } from "@Models/access.ts";
import { OauthScopesModel } from "@Models/oauth-scopes.ts";

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
              refreshable: e.boolean(),
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

    if (SessionInfo) {
      const AccountId = await e
        .string()
        .length({ min: 1 })
        .validate(
          ctx.router.request.headers.get("X-Account-ID") ??
            Object.keys(SessionInfo.session.scopes)[0],
          { name: `${scope}.headers.x-account-id` }
        );

      RequestedScopes = SessionInfo.session.scopes[AccountId] ?? [];

      const Access = await AccessModel.findOne(
        {
          account: AccountId,
          createdFor: SessionInfo.session.createdBy,
        },
        { role: 1 }
      );

      if (!Access) e.error("You don't have access to this account!");

      const Scopes = await OauthScopesModel.findOne(
        { role: Access!.role },
        { scopes: 1 }
      );

      if (!Scopes)
        e.error(
          `Unable to fetch the available scopes for the role '${Access!.role}'!`
        );

      AvailableScopes = Scopes?.scopes ?? [];

      ctx.router.state.auth = {
        userId: SessionInfo.session.createdBy,
        accountId: AccountId,
        role: Access!.role,
      };
    } else {
      const UnauthenticatedRole = "unauthenticated";
      const Scopes = await OauthScopesModel.findOne(
        { role: UnauthenticatedRole },
        { scopes: 1 }
      );

      if (!Scopes)
        e.error(
          `Unable to fetch the available scopes for the role '${UnauthenticatedRole}'!`
        );

      AvailableScopes = Scopes?.scopes ?? [];
      RequestedScopes = ["*"];
    }

    ctx.router.state.guard = new SecurityGuard(
      AvailableScopes,
      RequestedScopes
    );

    if (!ctx.router.state.guard.isPermitted(scope, name))
      throw createHttpError(
        Status.Unauthorized,
        `You are not permitted! Missing permission '${`${scope}.${name}`}'.`
      );
  },
};
