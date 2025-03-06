import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";
export interface IController$requestLogs {
    create<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        namespace?: string;
        requestId: string;
        method: string;
        url: string;
        headers?: {} & {
            [K: string]: string;
        };
        body?: any;
        auth: {
            secretId?: string;
            sessionId?: string;
            userId?: string;
            accountId?: string;
            isAccountOwned?: boolean;
            isAccountPrimary?: boolean;
            role?: string;
            accountRole?: string;
            resolvedRole?: string;
        };
        responseStatus: number;
        response: {
            status: boolean;
            messages: any;
            data: any;
            metrics?: {} & {
                [K: string]: any;
            };
            errorStack: any;
        };
        errorStack: any;
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
            createdBy?: ObjectId;
            account?: ObjectId;
            namespace?: string;
            requestId: string;
            method: string;
            url: string;
            headers?: {} & {
                [K: string]: string;
            };
            body: any;
            auth?: {
                secretId?: string;
                sessionId?: string;
                userId?: string;
                accountId?: string;
                isAccountOwned?: boolean;
                isAccountPrimary?: boolean;
                role?: string;
                accountRole?: string;
                resolvedRole?: string;
            };
            responseStatus: number;
            response: {
                status: boolean;
                messages: any;
                data: any;
                metrics?: {} & {
                    [K: string]: any;
                };
                errorStack: any;
            };
            errorStack: any;
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
                createdBy?: ObjectId;
                account?: ObjectId;
                namespace?: string;
                requestId: string;
                method: string;
                url: string;
                headers?: {} & {
                    [K: string]: string;
                };
                body: any;
                auth?: {
                    secretId?: string;
                    sessionId?: string;
                    userId?: string;
                    accountId?: string;
                    isAccountOwned?: boolean;
                    isAccountPrimary?: boolean;
                    role?: string;
                    accountRole?: string;
                    resolvedRole?: string;
                };
                responseStatus: number;
                response: {
                    status: boolean;
                    messages: any;
                    data: any;
                    metrics?: {} & {
                        [K: string]: any;
                    };
                    errorStack: any;
                };
                errorStack: any;
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
        namespace?: string;
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
                createdBy?: ObjectId;
                account?: ObjectId;
                namespace?: string;
                requestId: string;
                method: string;
                url: string;
                headers?: {} & {
                    [K: string]: string;
                };
                body: any;
                auth?: {
                    secretId?: string;
                    sessionId?: string;
                    userId?: string;
                    accountId?: string;
                    isAccountOwned?: boolean;
                    isAccountPrimary?: boolean;
                    role?: string;
                    accountRole?: string;
                    resolvedRole?: string;
                };
                responseStatus: number;
                response: {
                    status: boolean;
                    messages: any;
                    data: any;
                    metrics?: {} & {
                        [K: string]: any;
                    };
                    errorStack: any;
                };
                errorStack: any;
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
export declare const requestLogsModule: (sdk: any) => IController$requestLogs;
