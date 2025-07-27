import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$oauthSecrets$createFor = {
    query: {};
    params: {};
    body: {
        userId: string;
        name: string;
        scopes: (/*(optional)*/ {} & {
            [K: string]: Array<string>;
        }) | Array<string>;
        ttl?: number;
    };
    return: {
        status: boolean;
        data: {
            secret: {
                issuer: string;
                type: string;
                token: string;
                expiresAtSeconds: number;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    };
};
export type TRoute$oauthSecrets$create = {
    query: {};
    params: {};
    body: {
        name: string;
        scopes: (/*(optional)*/ {} & {
            [K: string]: Array<string>;
        }) | Array<string>;
        ttl?: number;
    };
    return: {
        status: boolean;
        data: {
            secret: {
                issuer: string;
                type: string;
                token: string;
                expiresAtSeconds: number;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    };
};
export type TRoute$oauthSecrets$delete = {
    query: {};
    params: {
        id: string;
    };
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauthSecrets$get = {
    query: {
        search?: string;
        range?: [Date, Date];
        offset?: number;
        limit?: number;
        sort?: /*(optional default:[object Object]) Provide a sorting information in mongodb sort object format*/ {} & {
            [K: string]: number;
        };
        project?: /*(optional) Provide a projection information in mongodb project object format*/ {} & {
            [K: string]: number;
        };
        includeTotalCount?: boolean;
    };
    params: {
        id?: string;
    };
    body: {};
    return: {
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                expiresAt?: Date;
                createdBy: ObjectId;
                oauthApp: ObjectId;
                name: string;
                scopes?: /*(optional)*/ {} & {
                    [K: string]: Array<string>;
                };
                isBlocked?: boolean;
            }>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    };
};
export interface IController$oauthSecrets {
    createFor<Method extends "post", QueryShape extends TRoute$oauthSecrets$createFor["query"], ParamsShape extends TRoute$oauthSecrets$createFor["params"], BodyShape extends TRoute$oauthSecrets$createFor["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$createFor["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<Method extends "post", QueryShape extends TRoute$oauthSecrets$create["query"], ParamsShape extends TRoute$oauthSecrets$create["params"], BodyShape extends TRoute$oauthSecrets$create["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$oauthSecrets$delete["query"], ParamsShape extends TRoute$oauthSecrets$delete["params"], BodyShape extends TRoute$oauthSecrets$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$oauthSecrets$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$oauthSecrets$get["query"], ParamsShape extends TRoute$oauthSecrets$get["params"], BodyShape extends TRoute$oauthSecrets$get["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const oauthSecretsModule: (sdk: any) => IController$oauthSecrets;
//# sourceMappingURL=oauthSecrets.d.ts.map