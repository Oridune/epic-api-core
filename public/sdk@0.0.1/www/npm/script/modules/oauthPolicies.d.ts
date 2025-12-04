import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$oauthPolicies$me = {
    query: {};
    params: {};
    body: {};
    return: {
        status: boolean;
        data: {
            accountId: string;
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
export type TRoute$oauthPolicies$create = {
    query: {};
    params: {};
    body: {
        role: string;
        scopes: Array<string>;
        subRoles?: Array<string>;
    };
    return: {
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
export type TRoute$oauthPolicies$update = {
    query: {};
    params: {
        id: string;
    };
    body: {
        role?: string;
        scopes?: Array<string>;
        subRoles?: Array<string>;
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauthPolicies$delete = {
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
export type TRoute$oauthPolicies$get = {
    query: {
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
export interface IController$oauthPolicies {
    me(): TRequestExecutors<TRoute$oauthPolicies$me["return"]>;
    me<Method extends "get", QueryShape extends TRoute$oauthPolicies$me["query"], ParamsShape extends TRoute$oauthPolicies$me["params"], BodyShape extends TRoute$oauthPolicies$me["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPolicies$me["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<Method extends "post", QueryShape extends TRoute$oauthPolicies$create["query"], ParamsShape extends TRoute$oauthPolicies$create["params"], BodyShape extends TRoute$oauthPolicies$create["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPolicies$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<Method extends "patch", QueryShape extends TRoute$oauthPolicies$update["query"], ParamsShape extends TRoute$oauthPolicies$update["params"], BodyShape extends TRoute$oauthPolicies$update["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPolicies$update["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$oauthPolicies$delete["query"], ParamsShape extends TRoute$oauthPolicies$delete["params"], BodyShape extends TRoute$oauthPolicies$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPolicies$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$oauthPolicies$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$oauthPolicies$get["query"], ParamsShape extends TRoute$oauthPolicies$get["params"], BodyShape extends TRoute$oauthPolicies$get["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPolicies$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const oauthPoliciesModule: (sdk: any) => IController$oauthPolicies;
//# sourceMappingURL=oauthPolicies.d.ts.map