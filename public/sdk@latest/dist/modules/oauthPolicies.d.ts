import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";
export interface IController$oauthPolicies {
    me(): TRequestExecutors<{
        status: boolean;
        data: {
            policy: {
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                role: string;
                scopes: Array<string>;
                subRoles?: Array<string>;
                ttl?: number;
            };
            scopePipeline: Array<Array<string>>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }>;
    me<Method extends "get", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            policy: {
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                role: string;
                scopes: Array<string>;
                subRoles?: Array<string>;
                ttl?: number;
            };
            scopePipeline: Array<Array<string>>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    create<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        role: string;
        scopes: Array<string>;
        subRoles?: Array<string>;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            _id?: ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
            role: string;
            scopes: Array<string>;
            subRoles?: Array<string>;
            ttl?: number;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    update<Method extends "patch", QueryShape extends {}, ParamsShape extends {
        id: string;
    }, BodyShape extends {
        role?: string;
        scopes?: Array<string>;
        subRoles?: Array<string>;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    delete<Method extends "delete", QueryShape extends {}, ParamsShape extends {
        id: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    get(): TRequestExecutors<{
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                role: string;
                scopes: Array<string>;
                subRoles?: Array<string>;
                ttl?: number;
            }>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }>;
    get<Method extends "get", QueryShape extends {
        search?: string;
        range?: Array<{} | undefined>;
        offset?: number;
        limit?: number;
        sort?: /*(optional default:[object Object])*/ {} & {
            [K: string]: number;
        };
        project?: /*(optional)*/ {} & {
            [K: string]: number;
        };
        includeTotalCount?: boolean;
    }, ParamsShape extends {
        id?: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                role: string;
                scopes: Array<string>;
                subRoles?: Array<string>;
                ttl?: number;
            }>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
}
export declare const oauthPoliciesModule: (sdk: any) => IController$oauthPolicies;
