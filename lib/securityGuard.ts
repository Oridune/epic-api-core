export type TScopeResolverOptions = {
  resolveRole?: (role: string) => Promise<Array<string> | undefined>;
};

export class SecurityGuard {
  protected ScopesCache: Record<string, Array<string>> = {};
  protected RawScopePipeline: Array<Array<string>> = [];
  protected ScopePipeline: Array<Set<string>> = [];

  protected resolveScopes(scopes: string[], options?: TScopeResolverOptions) {
    const RoleRegExp = /^role:(.*)/;

    const ResolveRole = async (
      role: string,
      set: Set<string>
    ): Promise<Set<string>> =>
      (this.ScopesCache[role] ??=
        (await options?.resolveRole?.(role)) ?? []).reduce(
        async (set, scope) => {
          const Set = await set;
          const Match = scope.match(RoleRegExp);

          if (Match) return ResolveRole(Match[1], Set);

          return Set.add(scope);
        },
        Promise.resolve(set)
      );

    return scopes.reduce(async (set, scope) => {
      const Set = await set;
      const Match = scope.match(RoleRegExp);

      if (Match) return ResolveRole(Match[1], Set);

      return Set.add(scope);
    }, Promise.resolve<Set<string>>(new Set()));
  }

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
        Resolvers.push(this.resolveScopes(TargetPipeline, options));
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
