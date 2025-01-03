export type TScopeResolverOptions = {
  resolveScopeRole?: (
    role: string,
  ) => Promise<Array<string> | undefined> | Array<string> | undefined;
  resolveDepth?: number;
};

export type TRawStage = Array<string> | {
  scopes: Array<string>;
  resolveDepth?: number;
};

export class SecurityGuard {
  static resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
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

  protected RawScopePipeline: Array<TRawStage> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  protected RawDenialScopePipeline: Array<TRawStage> = [];
  protected DenialScopePipeline: Array<Set<string>> = [];

  constructor() {}

  public addStage(
    stage: TRawStage,
    options?: { denial?: boolean },
  ) {
    if (options?.denial) this.RawDenialScopePipeline.push(stage);
    else this.RawScopePipeline.push(stage);

    return this;
  }

  public async compile(
    options?: TScopeResolverOptions,
  ) {
    await Promise.all(
      (["RawScopePipeline", "RawDenialScopePipeline"] as const).map(
        async (type) => {
          if (this[type].length) {
            const Resolvers: Array<
              Promise<Array<string>> | Array<string>
            > = [];

            this[type].forEach((stage) => {
              const Stage = stage instanceof Array ? { scopes: stage } : stage;

              const Scopes = Stage.scopes;
              const ResolveDepth = Stage.resolveDepth ?? Infinity;

              Resolvers.push(
                SecurityGuard.resolveScopes(Scopes, {
                  ...options,
                  resolveDepth: ResolveDepth,
                }),
              );
            });

            const Pipeline = await Promise.all(Resolvers);

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

  public isAllowed(scope: string, permission?: string, opts?: {
    customPipeline?: Array<Set<string>>;
    default?: boolean;
  }) {
    const Default = opts?.default ?? true;

    let Permitted = Default;

    const Pipeline = opts?.customPipeline ?? this.ScopePipeline;

    for (let i = 0; i < Pipeline.length; i++) {
      if ((Default && !Permitted) || (!Default && Permitted)) break;

      const Scopes = Pipeline[i];

      Permitted = Scopes.has("*") || Scopes.has(scope) ||
        (typeof permission === "string"
          ? Scopes.has(`${scope}.${permission}`)
          : false);

      if (
        Permitted && (Scopes.has(`-${scope}`) ||
          (typeof permission === "string"
            ? Scopes.has(`-${scope}.${permission}`)
            : Array.from(Scopes).some((_) => _.startsWith(`-${scope}`))))
      ) Permitted = false;
    }

    return Permitted;
  }

  public isDenied(scope: string, permission?: string, opts?: {
    customPipeline?: Array<Set<string>>;
  }) {
    return this.isAllowed(scope, permission, {
      customPipeline: opts?.customPipeline ?? this.DenialScopePipeline,
      default: false,
    });
  }

  public isPermitted(scope: string, permission?: string) {
    return this.isAllowed(scope, permission) &&
      !this.isDenied(scope, permission);
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
