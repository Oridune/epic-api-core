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
  static async resolveScopes(
    scopes: string[],
    options?: TScopeResolverOptions,
  ) {
    if (options?.resolveDepth === 0) return Array.from(new Set(scopes));

    const RoleRegExp = /^role:([A-Za-z_-]+)(\?.*)?/;
    const ScopesCache: Record<string, Array<string>> = {};

    const Scopes: string[] = [];

    await Promise.all(scopes.map(async (scope) => {
      const Match = scope.match(RoleRegExp);

      if (!Match) return Scopes.push(scope);

      const Role = Match[1];
      const Params = new URLSearchParams(Match[2]);
      const Excludes = Params.get("ex")?.trim().split(/\s*,\s*/);

      const _scopes = await SecurityGuard.resolveScopes(
        ScopesCache[Role] ??= await options?.resolveScopeRole?.(Role) ?? [],
        {
          resolveScopeRole: options?.resolveScopeRole,
          resolveDepth: typeof options?.resolveDepth === "number"
            ? options?.resolveDepth - 1
            : undefined,
        },
      );

      Scopes.push(
        ...(Excludes instanceof Array && Excludes.length
          ? _scopes.filter((scope) => !Excludes.includes(scope))
          : _scopes),
      );
    }));

    return Array.from(new Set(Scopes));
  }
  protected RawScopePipeline: Array<TRawStage> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  protected RawDenialScopePipeline: Array<TRawStage> = [];
  protected DenialScopePipeline: Array<Set<string>> = [];

  constructor() {}

  public isSuperUser = false;

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
        async (type, typeIndex) => {
          if (this[type].length) {
            const Pipeline = await Promise.all(
              this[type].map(async (stage, stageIndex) => {
                const Stage = stage instanceof Array
                  ? { scopes: stage }
                  : stage;

                const Scopes = Stage.scopes;
                const ResolveDepth = Stage.resolveDepth ?? Infinity;

                const ResolvedScopes = await SecurityGuard.resolveScopes(
                  Scopes,
                  {
                    ...options,
                    resolveDepth: ResolveDepth,
                  },
                );

                if (
                  typeIndex === 0 && stageIndex === 0 &&
                  ResolvedScopes.includes("*")
                ) this.isSuperUser = true;

                return ResolvedScopes;
              }),
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

  public load(
    data: {
      scopePipeline: Array<Set<string>>;
      denialScopePipeline?: Array<Set<string>>;
    },
  ) {
    if (data.scopePipeline instanceof Array) {
      this.ScopePipeline = data.scopePipeline;
    }

    if (data.denialScopePipeline instanceof Array) {
      this.DenialScopePipeline = data.denialScopePipeline;
    }

    return this;
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
