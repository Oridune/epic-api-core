import { SecurityGuard } from "@Lib/securityGuard.ts";
import { expect } from "expect";

const roles: Record<string, string[]> = {
  root: ["*"],
  unauthenticated: ["users.create"],
  user: ["role:unauthenticated", "posts.read"],
  limited: ["role:unauthenticated", "-users.create", "posts.read"],
  author: ["role:user", "posts"],
  admin: ["role:author", "role:limited"],
};

const resolveScopeRole = (role: string) => roles[role];

Deno.test({
  name: "Security guard Test",
  async fn(t) {
    await t.step("Check role resolver depth 0", async () => {
      const scopes = ["users.create", "role:unauthenticated"];
      const results = await SecurityGuard.resolveScopes(scopes, {
        resolveScopeRole,
        resolveDepth: 0,
      });

      expect({ s: results }).toMatchObject({ s: scopes });
    });

    await t.step("Check role resolver depth 1", async () => {
      const scopes = ["users.create", "role:unauthenticated"];
      const results = await SecurityGuard.resolveScopes(scopes, {
        resolveScopeRole,
        resolveDepth: 1,
      });

      expect({ s: results }).toMatchObject({ s: ["users.create"] });
    });

    await t.step("Check role resolver depth 2", async () => {
      const scopes = ["users.create", "role:author"];
      const results = await SecurityGuard.resolveScopes(scopes, {
        resolveScopeRole,
        resolveDepth: 2,
      });

      expect({ s: results }).toMatchObject({
        s: [
          "users.create",
          "posts",
          "role:unauthenticated",
          "posts.read",
        ],
      });
    });

    await t.step("Check role resolver depth infinity", async () => {
      const scopes = ["role:admin"];
      const results = await SecurityGuard.resolveScopes(scopes, {
        resolveScopeRole,
      });

      expect({ s: results }).toMatchObject({
        s: [
          "-users.create",
          "posts.read",
          "users.create",
          "posts",
        ],
      });
    });

    await t.step("Check role resolver with exclusion", async () => {
      const scopes = ["role:limited?ex=-users.create", "role:author"];
      const results = await SecurityGuard.resolveScopes(scopes, {
        resolveScopeRole,
      });

      expect({ s: results }).toMatchObject({
        s: [
          "posts.read",
          "users.create",
          "posts",
        ],
      });
    });

    await t.step("Check full permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage(["*"]);

      await guard.compile();

      expect(guard.isAllowed("any")).toBe(true);
    });

    await t.step("Check no permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage([]);

      await guard.compile();

      expect(guard.isAllowed("any")).toBe(false);
    });

    await t.step("Check multi-stage permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage(["*"]);
      guard.addStage(["any.foo"]);

      await guard.compile();

      expect(guard.isAllowed("any")).toBe(false);
      expect(guard.isAllowed("any.foo")).toBe(true);
    });

    await t.step("Check multi-stage permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage([]);
      guard.addStage(["any.foo"]);

      await guard.compile();

      expect(guard.isAllowed("any")).toBe(false);
      expect(guard.isAllowed("any.foo")).toBe(false);
    });

    await t.step("Check nested role permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage(["role:root"]);

      await guard.compile({ resolveScopeRole });

      expect(guard.isAllowed("posts")).toBe(true);
      expect(guard.isAllowed("posts", "write")).toBe(true);
      expect(guard.isAllowed("any")).toBe(true);
    });

    await t.step(
      "Check nested role permissions with inline denial",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:root", "-users.create"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isAllowed("users")).toBe(false);
        expect(guard.isAllowed("users", "create")).toBe(false);
        expect(guard.isAllowed("posts", "write")).toBe(true);
        expect(guard.isAllowed("any")).toBe(true);
      },
    );

    await t.step(
      "Check nested role permissions with inline denial 2",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:admin"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isAllowed("users")).toBe(false);
        expect(guard.isAllowed("users", "create")).toBe(false);
        expect(guard.isAllowed("posts", "write")).toBe(true);
      },
    );

    await t.step(
      "Check nested role permissions with inline denial and multi-stage",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:root"]);
        guard.addStage(["role:user", "-users.create"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isAllowed("users")).toBe(false);
        expect(guard.isAllowed("users", "create")).toBe(false);
        expect(guard.isAllowed("posts", "read")).toBe(true);
        expect(guard.isAllowed("posts", "write")).toBe(false);
        expect(guard.isAllowed("any")).toBe(false);
      },
    );

    await t.step("Check nested role permissions 2", async () => {
      const guard = new SecurityGuard();

      guard.addStage(["role:unauthenticated"]);

      await guard.compile({ resolveScopeRole });

      expect(guard.isAllowed("users.create")).toBe(true);
      expect(guard.isAllowed("users", "create")).toBe(true);
      expect(guard.isAllowed("posts.read")).toBe(false);
      expect(guard.isAllowed("posts", "read")).toBe(false);
    });

    await t.step("Check deeply nested role permissions", async () => {
      const guard = new SecurityGuard();

      guard.addStage(["role:author"]);

      await guard.compile({ resolveScopeRole });

      expect(guard.isAllowed("users.create")).toBe(true);
      expect(guard.isAllowed("posts.read")).toBe(true);
      expect(guard.isAllowed("posts.write")).toBe(false);
      expect(guard.isAllowed("posts", "write")).toBe(true);
      expect(guard.isAllowed("posts")).toBe(true);
      expect(guard.isAllowed("any")).toBe(false);
    });

    await t.step(
      "Check deeply nested role permissions with multi-stage",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:root"]);
        guard.addStage(["role:author"]);
        guard.addStage(["role:root"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isAllowed("users.create")).toBe(true);
        expect(guard.isAllowed("posts.read")).toBe(true);
        expect(guard.isAllowed("posts.write")).toBe(false);
        expect(guard.isAllowed("posts", "write")).toBe(true);
        expect(guard.isAllowed("posts")).toBe(true);
        expect(guard.isAllowed("any")).toBe(false);
      },
    );

    await t.step(
      "Check deeply nested role permissions with multi-stage 2",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:author"]);
        guard.addStage(["role:user"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isPermitted("users.create")).toBe(true);
        expect(guard.isPermitted("posts.read")).toBe(true);
        expect(guard.isPermitted("posts.write")).toBe(false);
        expect(guard.isPermitted("posts", "write")).toBe(false);
        expect(guard.isPermitted("posts")).toBe(false);
        expect(guard.isPermitted("any")).toBe(false);
      },
    );

    await t.step(
      "Check deeply nested role permissions with exclude",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:admin?ex=-users.create"]);

        await guard.compile({ resolveScopeRole });

        expect(guard.isPermitted("users.create")).toBe(true);
        expect(guard.isPermitted("posts.read")).toBe(true);
        expect(guard.isPermitted("posts.write")).toBe(false);
        expect(guard.isPermitted("posts", "write")).toBe(true);
        expect(guard.isPermitted("posts")).toBe(true);
        expect(guard.isPermitted("any")).toBe(false);
      },
    );

    await t.step(
      "Check permissions with denial role",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:root"]);
        guard.addStage(["role:unauthenticated"], { denial: true });

        await guard.compile({ resolveScopeRole });

        expect(guard.isAllowed("users.create")).toBe(true);
        expect(guard.isDenied("users.create")).toBe(true);
        expect(guard.isPermitted("users", "create")).toBe(false);
        expect(guard.isDenied("users", "create")).toBe(true);
        expect(guard.isPermitted("posts.read")).toBe(true);
        expect(guard.isPermitted("posts.write")).toBe(true);
        expect(guard.isPermitted("posts", "write")).toBe(true);
        expect(guard.isPermitted("posts")).toBe(true);
        expect(guard.isPermitted("any")).toBe(true);
      },
    );

    await t.step(
      "Check permissions with denial role 2",
      async () => {
        const guard = new SecurityGuard();

        guard.addStage(["role:root"]);
        guard.addStage(["role:root"], { denial: true });

        await guard.compile({ resolveScopeRole });

        expect(guard.isPermitted("users.create")).toBe(false);
        expect(guard.isPermitted("posts.read")).toBe(false);
        expect(guard.isPermitted("posts.write")).toBe(false);
        expect(guard.isPermitted("posts", "write")).toBe(false);
        expect(guard.isPermitted("posts")).toBe(false);
        expect(guard.isPermitted("any")).toBe(false);
      },
    );
  },
});
