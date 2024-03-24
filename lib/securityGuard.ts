import { Store } from "@Core/common/store.ts";
import crypto from "node:crypto";

export type TScopeResolverOptions = {
  resolveScopeRole?: (role: string) => Promise<Array<string> | undefined>;
};

export class SecurityGuard {
  static resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
    const RoleRegExp = /^role:(.*)/;
    const ScopesCache: Record<string, Array<string>> = {};

    const ResolveScopeRole = async (
      role: string,
      prevScopes: Array<string>,
    ): Promise<Array<string>> =>
      (ScopesCache[role] ??= (await options?.resolveScopeRole?.(role)) ?? [])
        .reduce(
          async (scopes, scope) => {
            const Scopes = await scopes;
            const Match = scope.match(RoleRegExp);

            if (Match) return ResolveScopeRole(Match[1], Scopes);

            Scopes.push(scope);

            return Scopes;
          },
          Promise.resolve(prevScopes),
        );

    return scopes.reduce(async (scopes, scope) => {
      const Scopes = await scopes;
      const Match = scope.match(RoleRegExp);

      if (Match) return ResolveScopeRole(Match[1], Scopes);

      Scopes.push(scope);

      return Scopes;
    }, Promise.resolve<Array<string>>([]));
  }

  protected RawScopePipeline: Array<Array<string>> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  protected RawDenialScopePipeline: Array<Array<string>> = [];
  protected DenialScopePipeline: Array<Set<string>> = [];

  constructor() {}

  public addStage(scopes: Array<string>, denial = false) {
    if (denial) this.RawDenialScopePipeline.push(scopes);
    else this.RawScopePipeline.push(scopes);

    return this;
  }

  public async parse(
    options?: TScopeResolverOptions & { cacheTimeMs?: number },
  ) {
    const CacheTime = options?.cacheTimeMs ?? 60 * 10 * 1000; // 10 minutes default cache

    await Promise.all(
      (["RawScopePipeline", "RawDenialScopePipeline"] as const).map(
        async (type) => {
          if (this[type].length) {
            const CacheKey = crypto.sign(
              "md5",
              new TextEncoder().encode(
                this[type].toString(),
              ),
              "SecurityGuard",
            ).toString("hex");

            this[
              type.replace(/^Raw/, "") as
                | "ScopePipeline"
                | "DenialScopePipeline"
            ] = (
              await Store.cache(
                CacheKey,
                () => {
                  const Resolvers: Array<Promise<Array<string>>> = [];

                  this[type].forEach((pipeline) => {
                    if (pipeline instanceof Array) {
                      Resolvers.push(
                        SecurityGuard.resolveScopes(pipeline, options),
                      );
                    }
                  });

                  return Promise.all(Resolvers);
                },
                CacheTime, // 10 minutes default cache
              )
            ).map((list) => new Set(list));
          }
        },
      ),
    );
  }

  public isPermitted(scope: string, permission?: string) {
    let Permitted = true;

    for (let i = 0; i < this.ScopePipeline.length; i++) {
      if (!Permitted) break;

      const Stage = this.ScopePipeline[i];

      if (Stage.has("*")) continue;
      if (Stage.has(scope)) continue;

      Permitted = typeof permission === "string"
        ? Stage.has(`${scope}.${permission}`)
        : false;
    }

    if (Permitted) {
      for (let i = 0; i < this.DenialScopePipeline.length; i++) {
        if (!Permitted) break;

        const Stage = this.DenialScopePipeline[i];

        if (Stage.has("*")) Permitted = false;
        if (Stage.has(scope)) Permitted = false;

        if (Permitted) {
          Permitted = typeof permission === "string"
            ? !Stage.has(`${scope}.${permission}`)
            : true;
        }
      }
    }

    return Permitted;
  }

  public toJSON() {
    return {
      scopePipeline: this.ScopePipeline.map((stage) => Array.from(stage)),
    };
  }
}
