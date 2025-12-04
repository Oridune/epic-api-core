import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$requestLogs$create = {
    query: {};
    params: {};
    body: {
        namespace?: string;
        requestId: string;
        method: "get" | "post" | "patch" | "put" | "delete" | "options";
        url: string;
        headers: {} & {
            [K: string]: string;
        };
        body?: any;
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
        response?: {
            status: boolean;
            messages?: any;
            data?: any;
            metadata?: /*(optional)*/ {} & {
                [K: string]: any;
            };
            errorStack?: any;
            metrics: {} & {
                [K: string]: any;
            };
        };
        errorStack?: any;
    };
    return: {
        status: boolean;
        data: {
            _id?: ObjectId;
            createdAt?: Date;
            createdBy?: ObjectId;
            account?: ObjectId;
            namespace?: string;
            requestId: string;
            method: "get" | "post" | "patch" | "put" | "delete" | "options";
            url: string;
            headers: {} & {
                [K: string]: string;
            };
            body?: any;
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
            response?: {
                status: boolean;
                messages?: any;
                data?: any;
                metadata?: /*(optional)*/ {} & {
                    [K: string]: any;
                };
                errorStack?: any;
                metrics: {} & {
                    [K: string]: any;
                };
            };
            errorStack?: any;
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
export type TRoute$requestLogs$delete = {
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
export type TRoute$requestLogs$get = {
    query: {
        namespace?: string;
        search?: string;
        filters?: (/*(optional)*/ {} & {
            [K: string]: {
                $not: {
                    $eq?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $ne?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $in?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $nin?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $all?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $lt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $lte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $mod?: [number, number];
                    $regex?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                };
            } | {
                $eq?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $ne?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $in?: Array<{
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string>;
                $nin?: Array<{
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string>;
                $all?: Array<{
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string>;
                $lt?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $lte?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $gt?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $gte?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
                $mod?: [number, number];
                $regex?: /*(optional)*/ {
                    type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                    value: string;
                    options?: {
                        regexFlags?: string;
                    };
                } | string;
            };
        }) | /*(optional)*/ {
            $and?: Array<{} & {
                [K: string]: {
                    $not: {
                        $eq?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $ne?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $in?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $nin?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $all?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $lt?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $lte?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $gt?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $gte?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $mod?: [number, number];
                        $regex?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                    };
                } | {
                    $eq?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $ne?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $in?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $nin?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $all?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $lt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $lte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $mod?: [number, number];
                    $regex?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                };
            }>;
            $or?: Array<{} & {
                [K: string]: {
                    $not: {
                        $eq?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $ne?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $in?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $nin?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $all?: Array<{
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string>;
                        $lt?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $lte?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $gt?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $gte?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                        $mod?: [number, number];
                        $regex?: /*(optional)*/ {
                            type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                            value: string;
                            options?: {
                                regexFlags?: string;
                            };
                        } | string;
                    };
                } | {
                    $eq?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $ne?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $in?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $nin?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $all?: Array<{
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string>;
                    $lt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $lte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gt?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $gte?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                    $mod?: [number, number];
                    $regex?: /*(optional)*/ {
                        type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
                        value: string;
                        options?: {
                            regexFlags?: string;
                        };
                    } | string;
                };
            }>;
        };
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
                createdBy?: ObjectId;
                account?: ObjectId;
                namespace?: string;
                requestId: string;
                method: "get" | "post" | "patch" | "put" | "delete" | "options";
                url: string;
                headers: {} & {
                    [K: string]: string;
                };
                body?: any;
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
                response?: {
                    status: boolean;
                    messages?: any;
                    data?: any;
                    metadata?: /*(optional)*/ {} & {
                        [K: string]: any;
                    };
                    errorStack?: any;
                    metrics: {} & {
                        [K: string]: any;
                    };
                };
                errorStack?: any;
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
export interface IController$requestLogs {
    create<Method extends "post", QueryShape extends TRoute$requestLogs$create["query"], ParamsShape extends TRoute$requestLogs$create["params"], BodyShape extends TRoute$requestLogs$create["body"], ReturnShape extends TResponseShape<any> = TRoute$requestLogs$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$requestLogs$delete["query"], ParamsShape extends TRoute$requestLogs$delete["params"], BodyShape extends TRoute$requestLogs$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$requestLogs$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$requestLogs$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$requestLogs$get["query"], ParamsShape extends TRoute$requestLogs$get["params"], BodyShape extends TRoute$requestLogs$get["body"], ReturnShape extends TResponseShape<any> = TRoute$requestLogs$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const requestLogsModule: (sdk: any) => IController$requestLogs;
//# sourceMappingURL=requestLogs.d.ts.map