export type TScopeResolverOptions = {
    resolveScopeRole?: (role: string) => Promise<Array<string> | undefined> | Array<string> | undefined;
    resolveDepth?: number;
};
export type TRawStage = Array<string> | {
    scopes: Array<string>;
    resolveDepth?: number;
};
export declare class SecurityGuard {
    static resolveScopes(scopes: string[], options?: TScopeResolverOptions): Promise<string[]>;
    protected RawScopePipeline: Array<TRawStage>;
    protected ScopePipeline: Array<Set<string>>;
    protected RawDenialScopePipeline: Array<TRawStage>;
    protected DenialScopePipeline: Array<Set<string>>;
    constructor();
    isSuperUser: boolean;
    addStage(stage: TRawStage, options?: {
        denial?: boolean;
    }): this;
    compile(options?: TScopeResolverOptions): Promise<void>;
    load(data: {
        scopePipeline: Array<Set<string>>;
        denialScopePipeline?: Array<Set<string>>;
    }): this;
    isAllowed(scope: string, permission?: string, opts?: {
        customPipeline?: Array<Set<string>>;
        default?: boolean;
    }): boolean;
    isDenied(scope: string, permission?: string, opts?: {
        customPipeline?: Array<Set<string>>;
    }): boolean;
    isPermitted(scope: string, permission?: string): boolean;
    toJSON(): {
        scopePipeline: string[][];
        denialScopePipeline: string[][];
    };
}
