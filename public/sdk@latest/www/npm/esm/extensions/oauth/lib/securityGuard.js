export class SecurityGuard {
    static async resolveScopes(scopes, options) {
        if (options?.resolveDepth === 0)
            return Array.from(new Set(scopes));
        const RoleRegExp = /^role:([A-Za-z_-]+)(\?.*)?/;
        const ScopesCache = {};
        const Scopes = [];
        await Promise.all(scopes.map(async (scope) => {
            const Match = scope.match(RoleRegExp);
            if (!Match)
                return Scopes.push(scope);
            const Role = Match[1];
            const Params = new URLSearchParams(Match[2]);
            const Excludes = Params.get("ex")?.trim().split(/\s*,\s*/);
            const _scopes = await SecurityGuard.resolveScopes(ScopesCache[Role] ??= await options?.resolveScopeRole?.(Role) ?? [], {
                resolveScopeRole: options?.resolveScopeRole,
                resolveDepth: typeof options?.resolveDepth === "number"
                    ? options?.resolveDepth - 1
                    : undefined,
            });
            Scopes.push(...(Excludes instanceof Array && Excludes.length
                ? _scopes.filter((scope) => !Excludes.includes(scope))
                : _scopes));
        }));
        return Array.from(new Set(Scopes));
    }
    constructor() {
        Object.defineProperty(this, "RawScopePipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "ScopePipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "RawDenialScopePipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "DenialScopePipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "isSuperUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    addStage(stage, options) {
        if (options?.denial)
            this.RawDenialScopePipeline.push(stage);
        else
            this.RawScopePipeline.push(stage);
        return this;
    }
    async compile(options) {
        await Promise.all(["RawScopePipeline", "RawDenialScopePipeline"].map(async (type, _typeIndex) => {
            if (this[type].length) {
                const Pipeline = await Promise.all(this[type].map(async (stage, _stageIndex) => {
                    const Stage = stage instanceof Array
                        ? { scopes: stage }
                        : stage;
                    const Scopes = Stage.scopes;
                    const ResolveDepth = Stage.resolveDepth ?? Infinity;
                    const ResolvedScopes = await SecurityGuard.resolveScopes(Scopes, {
                        ...options,
                        resolveDepth: ResolveDepth,
                    });
                    return ResolvedScopes;
                }));
                this[type.replace(/^Raw/, "")] = Pipeline.map((list) => new Set(list));
            }
        }));
        if (!this.ScopePipeline.filter((scopes) => !scopes.has("*")).length) {
            this.isSuperUser = true;
        }
    }
    load(data) {
        if (data.scopePipeline instanceof Array) {
            this.ScopePipeline = data.scopePipeline;
        }
        if (data.denialScopePipeline instanceof Array) {
            this.DenialScopePipeline = data.denialScopePipeline;
        }
        return this;
    }
    isAllowed(scope, permission, opts) {
        const Default = opts?.default ?? true;
        let Permitted = Default;
        const Pipeline = opts?.customPipeline ?? this.ScopePipeline;
        for (let i = 0; i < Pipeline.length; i++) {
            if ((Default && !Permitted) || (!Default && Permitted))
                break;
            const Scopes = Pipeline[i];
            Permitted = Scopes.has("*") || Scopes.has(scope) ||
                (typeof permission === "string"
                    ? Scopes.has(`${scope}.${permission}`)
                    : false);
            if (Permitted && (Scopes.has(`-${scope}`) ||
                (typeof permission === "string"
                    ? Scopes.has(`-${scope}.${permission}`)
                    : Array.from(Scopes).some((_) => _.startsWith(`-${scope}`)))))
                Permitted = false;
        }
        return Permitted;
    }
    isDenied(scope, permission, opts) {
        return this.isAllowed(scope, permission, {
            customPipeline: opts?.customPipeline ?? this.DenialScopePipeline,
            default: false,
        });
    }
    isPermitted(scope, permission) {
        return this.isAllowed(scope, permission) &&
            !this.isDenied(scope, permission);
    }
    toJSON() {
        return {
            scopePipeline: this.ScopePipeline.map((stage) => Array.from(stage)),
            denialScopePipeline: this.DenialScopePipeline.map((stage) => Array.from(stage)),
        };
    }
}
