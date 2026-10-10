import "../index.d.ts";

import { expect } from "expect";

// There is no .env in the repo, so give the module graph what it reads at
// import time, and a scratch database this suite is free to drop.
for (
  const [Key, Value] of Object.entries({
    ENV_TYPE: "test",
    DISPLAY_NAME: "Test",
    ENCRYPTION_KEY: "test-encryption-key",
    STORE_TYPE: "map",
    DATABASE_CONNECTION_STRING:
      "mongodb://localhost:27017/epic-api-core-expiry-test",
  })
) if (!Deno.env.get(Key)) Deno.env.set(Key, Value);

// Models load before controllers in the app; keep that order here too.
await import("@Models/oauthApp.ts");

const { Database } = await import("@Database");
const { ObjectId } = await import("mongo");
const { Env, Store } = await import("@Core/common/mod.ts");
const { UserModel } = await import("@Models/user.ts");
const { AccountModel } = await import("@Models/account.ts");
const { CollaboratorModel } = await import("@Models/collaborator.ts");
const { OauthPolicyModel } = await import("@Models/oauthPolicy.ts");
// Hooks have no import map alias, the Loader picks them up by path.
const { default: checkPermissions, ResolveScopeRole } = await import(
  "../hooks/checkPermissions.ts"
);
const { SecurityGuard } = await import("@Lib/securityGuard.ts");
const { SyncOauthPolicies } = await import("@Jobs/syncOauthPolicies.ts");
const { AccountInviteModel } = await import("@Models/accountInvite.ts");
const { default: AccountInvitesController } = await import(
  "@Controllers/accountInvites.ts"
);
const { default: CollaboratorsController } = await import(
  "@Controllers/collaborators.ts"
);

/** Pull a route's handler out of its `Versioned` wrapper. */
// deno-lint-ignore no-explicit-any
const handlerOf = (versioned: any) =>
  versioned.toMap().get("1.0.0").handler as (
    // deno-lint-ignore no-explicit-any
    ctx: any,
    // deno-lint-ignore no-explicit-any
  ) => Promise<any>;

const DAY = 86400000;

/** `Env` memoizes the whole environment on first read, so clear that too. */
const setEnv = (key: string, value?: string) => {
  if (value === undefined) Deno.env.delete(key);
  else Deno.env.set(key, value);

  Env.configuration = undefined;
};

Deno.test({
  name: "collaborator access expiry",
  // The mongo driver keeps its own pool, which the sanitizers read as a leak.
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    await Database.connect();
    await Database.connection.drop();

    await OauthPolicyModel.create({ role: "root", scopes: ["*"] });

    const UserId = new ObjectId();
    const AccountId = new ObjectId();

    await UserModel.create({
      _id: UserId,
      username: "collaborator",
      password: "secret123",
      passwordHistory: ["secret123"],
      fname: "Collab",
      oauthApp: new ObjectId(),
      role: "root",
      collaborates: [new ObjectId()],
    });

    await AccountModel.create({
      _id: AccountId,
      createdBy: UserId,
      createdFor: UserId,
    });

    const Collaborator = await CollaboratorModel.create({
      // Same as the user, so the role cascade lookup is skipped.
      createdBy: UserId,
      createdFor: UserId,
      account: AccountId,
      role: "root",
      isOwned: true,
      isPrimary: true,
      expiresAt: new Date(Date.now() - DAY),
    });

    /** Run the permission hook the way the router does, on a stub context. */
    const call = (
      scope = "users",
      name = "get",
      sessionId = new ObjectId().toString(),
      accountId = AccountId,
    ) => {
      // deno-lint-ignore no-explicit-any
      const ctx: any = {
        router: {
          state: {
            sessionInfo: {
              claims: { sessionId },
              session: {
                scopes: { [accountId.toString()]: ["*"] },
                createdBy: UserId.toString(),
              },
            },
          },
          request: {
            headers: new Headers({ "X-Account-ID": accountId.toString() }),
          },
        },
      };

      return checkPermissions.pre(scope, name, ctx).then(() => ctx);
    };

    const refusal = (promise: Promise<unknown>) =>
      // deno-lint-ignore no-explicit-any
      promise.then(() => null, (error): any => error);

    await t.step(
      "flag off: an expired collaborator is let through",
      async () => {
        setEnv("COLLABORATOR_EXPIRY_ENABLED");

        const ctx = await call();

        expect(ctx.router.state.auth.accountId).toBe(AccountId.toString());
      },
    );

    await t.step("flag on: an expired collaborator is refused", async () => {
      setEnv("COLLABORATOR_EXPIRY_ENABLED", "true");

      const Refusal = await refusal(call());

      expect(Refusal?.getStatusCode?.()).toBe(403);
      expect(Refusal?.getBody?.()?.data?.code).toBe("collaborator_expired");
    });

    await t.step(
      "an exempt route still passes, with auth populated",
      async () => {
        setEnv("COLLABORATOR_EXPIRY_EXEMPT", "misc.createIDToken");

        const ctx = await call("misc", "createIDToken");

        expect(ctx.router.state.auth.accountId).toBe(AccountId.toString());

        setEnv("COLLABORATOR_EXPIRY_EXEMPT");
      },
    );

    await t.step(
      "a renewal takes effect on the very next request",
      async () => {
        await CollaboratorModel.updateOne(Collaborator._id, {
          expiresAt: new Date(Date.now() + 30 * DAY),
        });

        const ctx = await call();

        expect(ctx.router.state.auth.accountId).toBe(AccountId.toString());
      },
    );

    await t.step("an unexpired collaborator is unaffected", async () => {
      await Store.del("roleCache:root");

      const ctx = await call();

      expect(ctx.router.state.auth.accountId).toBe(AccountId.toString());
    });

    await t.step("their other accounts keep working", async () => {
      // Expiry is per collaborator, and a collaborator is per account.
      const OtherAccountId = new ObjectId();

      await AccountModel.create({
        _id: OtherAccountId,
        createdBy: UserId,
        createdFor: UserId,
      });

      await CollaboratorModel.create({
        createdBy: UserId,
        createdFor: UserId,
        account: OtherAccountId,
        role: "root",
        isOwned: true,
        isPrimary: false,
      });

      await CollaboratorModel.updateOne(Collaborator._id, {
        expiresAt: new Date(Date.now() - DAY),
      });

      setEnv("COLLABORATOR_EXPIRY_ENABLED", "true");

      // Expired here.
      expect((await refusal(call()))?.getStatusCode?.()).toBe(403);

      // Fine there.
      const ctx = await call(
        "users",
        "get",
        new ObjectId().toString(),
        OtherAccountId,
      );

      expect(ctx.router.state.auth.accountId).toBe(OtherAccountId.toString());
    });

    await t.step(
      "a json cached auth is still refused, the way production caches it",
      async () => {
        await CollaboratorModel.updateOne(Collaborator._id, {
          expiresAt: new Date(Date.now() - DAY),
        });

        const SessionId = new ObjectId().toString();
        const CacheKey = `checkPermissions:${SessionId}:${AccountId}`;

        // The cache only runs in production, and the redis store puts the
        // value through JSON: `expiresAt` comes back an ISO string and `_id`
        // a hex string. That combination cannot happen in dev or test, so
        // seed it here rather than let it surface only once deployed.
        Deno.env.set("ENV_TYPE", "production");

        await refusal(call("users", "get", SessionId));

        const Cached = await Store.get(CacheKey);

        expect(Cached).not.toBe(null);

        await Store.set(CacheKey, JSON.parse(JSON.stringify(Cached)), {
          expiresInMs: 60000,
        });

        const Refusal = await refusal(call("users", "get", SessionId));

        expect(Refusal?.getStatusCode?.()).toBe(403);
        expect(Refusal?.getBody?.()?.data?.code).toBe("collaborator_expired");

        Deno.env.set("ENV_TYPE", "test");
      },
    );

    // ---- the invite side of the feature ----

    const acceptInvite = handlerOf(
      // deno-lint-ignore no-explicit-any
      new CollaboratorsController().create({ scope: "collaborators" } as any),
    );

    const createInvite = handlerOf(
      new AccountInvitesController().create(
        // deno-lint-ignore no-explicit-any
        { scope: "accountInvites" } as any,
      ),
    );

    /** Accept an invite as our test user, returning the new collaborator. */
    const accept = async (token: string) => {
      const Res = await acceptInvite({
        router: {
          state: {
            auth: {
              userId: UserId.toString(),
              user: { username: "collaborator" },
            },
            scopePipeline: { requested: ["*"] },
          },
          params: { token },
        },
      });

      return Res.getBody().data;
    };

    /** Create an invite for our test user, as somebody else. */
    const inviteAs = (
      // deno-lint-ignore no-explicit-any
      body: Record<string, any>,
      // deno-lint-ignore no-explicit-any
      guard: any,
    ) =>
      createInvite({
        router: {
          state: {
            auth: {
              userId: new ObjectId().toString(),
              accountId: new ObjectId(),
              user: { username: "inviter", email: null, phone: null },
            },
            guard,
          },
          request: {
            url: { search: "" },
            body: { json: () => Promise.resolve(body) },
          },
        },
        // deno-lint-ignore no-explicit-any
      }) as Promise<any>;

    /** The cheap stub, for cases that are not about the guard itself. */
    const invite = (
      // deno-lint-ignore no-explicit-any
      body: Record<string, any>,
      permitted = true,
    ) => inviteAs(body, { isPermitted: () => permitted });

    /** A real guard, compiled from the policies the app actually ships. */
    const realGuard = async (extraScopes: string[] = []) => {
      const Scopes = ["role:user", ...extraScopes];

      const Guard = new SecurityGuard()
        .addStage(Scopes)
        .addStage(Scopes)
        .addStage(["*"])
        .addStage(["*"]);

      await Guard.compile({ resolveScopeRole: ResolveScopeRole });

      return Guard;
    };

    await t.step(
      "an invite carries its period to the collaborator",
      async () => {
        const Invite = await AccountInviteModel.create({
          createdBy: new ObjectId(),
          recipient: "collaborator",
          role: "user",
          accessDays: 30,
          account: new ObjectId(),
        });

        const Collaborator = await accept(Invite.token);

        expect(Collaborator.accessDays).toBe(30);
        expect(
          Math.round(
            (new Date(Collaborator.expiresAt).getTime() - Date.now()) / DAY,
          ),
        ).toBe(30);
      },
    );

    await t.step("a null period is stored, and never expires", async () => {
      const Invite = await AccountInviteModel.create({
        createdBy: new ObjectId(),
        recipient: "collaborator",
        role: "user",
        accessDays: null,
        account: new ObjectId(),
      });

      const Collaborator = await accept(Invite.token);

      expect(Collaborator.accessDays).toBe(null);
      expect(Collaborator.expiresAt).toBe(undefined);
    });

    await t.step("an invite with no period behaves as before", async () => {
      const Invite = await AccountInviteModel.create({
        createdBy: new ObjectId(),
        recipient: "collaborator",
        role: "user",
        account: new ObjectId(),
      });

      const Collaborator = await accept(Invite.token);

      expect(Collaborator.accessDays).toBe(undefined);
      expect(Collaborator.expiresAt).toBe(undefined);
    });

    await t.step("setting a period needs the permission", async () => {
      const Before = await AccountInviteModel.count();

      const Refusal = await refusal(
        invite(
          { recipient: "collaborator", role: "user", accessDays: 30 },
          false,
        ),
      );

      expect(Refusal?.getStatusCode?.()).toBe(403);
      expect(Refusal?.getBody?.()?.data?.code).toBe(
        "access_override_forbidden",
      );

      // Refused outright, rather than the field being dropped quietly.
      expect(await AccountInviteModel.count()).toBe(Before);
    });

    await t.step(
      "an unprivileged invite with no period still works",
      async () => {
        const Res = await invite(
          { recipient: "collaborator", role: "user" },
          false,
        );

        expect(Res.getBody().data.role).toBe("user");
      },
    );

    await t.step("the default user policy cannot set a period", async () => {
      await SyncOauthPolicies();

      const Guard = await realGuard();

      // The trap. `accountInvites` is granted whole to `unverified`, which
      // every role inherits, and `isAllowed` takes a whole scope as implying
      // every permission under it. Gating on this route's own scope would
      // therefore have gated nobody at all.
      expect(Guard.isPermitted("accountInvites", "accessDays")).toBe(true);
      expect(Guard.isPermitted("collaboratorExpiry", "override")).toBe(false);

      for (const accessDays of [30, null]) {
        const Refusal = await refusal(
          inviteAs(
            { recipient: "collaborator", role: "user", accessDays },
            Guard,
          ),
        );

        expect(Refusal?.getStatusCode?.()).toBe(403);
        expect(Refusal?.getBody?.()?.data?.code).toBe(
          "access_override_forbidden",
        );
      }
    });

    await t.step("an explicit override grant may set a period", async () => {
      const Guard = await realGuard(["collaboratorExpiry.override"]);

      const Res = await inviteAs(
        { recipient: "collaborator", role: "user", accessDays: 30 },
        Guard,
      );

      expect(Res.getBody().data.accessDays).toBe(30);
    });

    setEnv("COLLABORATOR_EXPIRY_ENABLED");

    await Database.connection.drop();
    await Database.disconnect();
  },
});
