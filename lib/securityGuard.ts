import { Store } from "@Core/common/store.ts";
import crypto from "node:crypto";

export type TScopeResolverOptions = {
  resolveScopeRole?: (role: string) => Promise<Array<string> | undefined>;
  resolveDepth?: number;
};

export type TStage = Array<string> | {
  scopes: Array<string>;
  resolveDepth?: number;
};

export class SecurityGuard {
  static resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
    if (typeof options?.resolveDepth === "number" && options.resolveDepth < 1) {
      return scopes;
    }

    const RoleRegExp = /^role:(.*)/;
    const ScopesCache: Record<string, Array<string>> = {};

    const ResolveScopeRole = async (
      role: string,
      prevScopes: Array<string>,
      level = 0,
    ): Promise<Array<string>> =>
      (ScopesCache[role] ??= (await options?.resolveScopeRole?.(role)) ?? [])
        .reduce(
          async (scopes, scope) => {
            const Scopes = await scopes;
            const Match = scope.match(RoleRegExp);

            if (
              Match &&
              (typeof options?.resolveDepth !== "number" ||
                (options.resolveDepth > level))
            ) return ResolveScopeRole(Match[1], Scopes, level + 1);

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

  protected RawScopePipeline: Array<TStage> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  protected RawDenialScopePipeline: Array<TStage> = [];
  protected DenialScopePipeline: Array<Set<string>> = [];

  constructor() {}

  public addStage(
    stage: TStage,
    options?: { denial?: boolean },
  ) {
    if (options?.denial) this.RawDenialScopePipeline.push(stage);
    else this.RawScopePipeline.push(stage);

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
            const CacheKey = crypto.createHash("md5").update(
              this[type].toString(),
            ).digest("hex");

            const Pipeline = await Store.cache(
              CacheKey,
              () => {
                const Resolvers: Array<
                  Promise<Array<string>> | Array<string>
                > = [];

                this[type].forEach((stage) => {
                  const Stage = stage instanceof Array
                    ? { scopes: stage }
                    : stage;

                  const Scopes = Stage.scopes;
                  const ResolveDepth = Stage.resolveDepth ?? Infinity;

                  Resolvers.push(
                    SecurityGuard.resolveScopes(Scopes, {
                      ...options,
                      resolveDepth: ResolveDepth,
                    }),
                  );
                });

                return Promise.all(Resolvers);
              },
              CacheTime, // 10 minutes default cache
            );

            this[
              type.replace(/^Raw/, "") as
                | "ScopePipeline"
                | "DenialScopePipeline"
            ] = Pipeline.map((list) => new Set(list));
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
      denialScopePipeline: this.DenialScopePipeline.map((stage) =>
        Array.from(stage)
      ),
    };
  }
}
