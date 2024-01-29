import { Store } from "@Core/common/store.ts";

export type TScopeResolverOptions = {
  resolveScopeRole?: (role: string) => Promise<Array<string> | undefined>;
};

export class SecurityGuard {
  static resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
    const RoleRegExp = /^role:(.*)/;
    const ScopesCache: Record<string, Array<string>> = {};

    const ResolveScopeRole = async (
      role: string,
      prevScopes: Array<string>
    ): Promise<Array<string>> =>
      (ScopesCache[role] ??=
        (await options?.resolveScopeRole?.(role)) ?? []).reduce(
        async (scopes, scope) => {
          const Scopes = await scopes;
          const Match = scope.match(RoleRegExp);

          if (Match) return ResolveScopeRole(Match[1], Scopes);

          Scopes.push(scope);

          return Scopes;
        },
        Promise.resolve(prevScopes)
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

  constructor() {}

  public addStage(scopes: Array<string>) {
    this.RawScopePipeline.push(scopes);
    return this;
  }

  public async parse(
    options?: TScopeResolverOptions & { cacheTimeMs?: number }
  ) {
    const CacheKey = this.RawScopePipeline.map((_) => _.join(",")).join("|");

    this.ScopePipeline.push(
      ...(
        await Store.cache(
          CacheKey,
          () => {
            const Resolvers: Array<Promise<Array<string>>> = [];

            this.RawScopePipeline.forEach((pipeline) => {
              if (pipeline instanceof Array)
                Resolvers.push(SecurityGuard.resolveScopes(pipeline, options));
            });

            return Promise.all(Resolvers);
          },
          options?.cacheTimeMs ?? 60 * 10 * 1000 // 10 minutes default cache
        )
      ).map((list) => new Set(list))
    );
  }

  public isPermitted(scope: string, permission?: string) {
    let Permitted = true;

    for (let i = 0; i < this.ScopePipeline.length; i++) {
      if (!Permitted) break;

      const Stage = this.ScopePipeline[i];

      if (Stage.has("*")) continue;
      if (Stage.has(scope)) continue;

      Permitted =
        typeof permission === "string"
          ? Stage.has(`${scope}.${permission}`)
          : false;
    }

    return Permitted;
  }

  public toJSON() {
    return {
      scopePipeline: this.ScopePipeline.map((stage) => Array.from(stage)),
    };
  }
}
