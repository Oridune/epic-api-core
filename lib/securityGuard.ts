export type TScopeResolverOptions = {
  resolveScopeRole?: (role: string) => Promise<Array<string> | undefined>;
};

export class SecurityGuard {
  static resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
    const RoleRegExp = /^role:(.*)/;
    const ScopesCache: Record<string, Array<string>> = {};

    const ResolveScopeRole = async (
      role: string,
      set: Set<string>
    ): Promise<Set<string>> =>
      (ScopesCache[role] ??=
        (await options?.resolveScopeRole?.(role)) ?? []).reduce(
        async (set, scope) => {
          const Set = await set;
          const Match = scope.match(RoleRegExp);

          if (Match) return ResolveScopeRole(Match[1], Set);

          return Set.add(scope);
        },
        Promise.resolve(set)
      );

    return scopes.reduce(async (set, scope) => {
      const Set = await set;
      const Match = scope.match(RoleRegExp);

      if (Match) return ResolveScopeRole(Match[1], Set);

      return Set.add(scope);
    }, Promise.resolve<Set<string>>(new Set()));
  }

  protected RawScopePipeline: Array<Array<string>> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  constructor() {}

  public addStage(scopes: Array<string>) {
    this.RawScopePipeline.push(scopes);
    return this;
  }

  public async parse(options?: TScopeResolverOptions) {
    const Resolvers: Array<Promise<Set<string>>> = [];

    do {
      const TargetPipeline = this.RawScopePipeline.shift();

      if (TargetPipeline instanceof Array)
        Resolvers.push(SecurityGuard.resolveScopes(TargetPipeline, options));
    } while (this.RawScopePipeline.length);

    this.ScopePipeline.push(
      ...(await Promise.all(Resolvers)).map((list) => new Set(list))
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
