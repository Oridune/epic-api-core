import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$envs$create = {
    query: {};
    params: {};
    body: {
        key: string;
        value: string;
        ttl?: number;
    };
    return: {
        status: boolean;
        data: {
            _id?: ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
            key: string;
            value: string;
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
export type TRoute$envs$update = {
    query: {};
    params: {
        id: string;
    };
    body: {
        key?: string;
        value?: string;
        ttl?: number;
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$envs$delete = {
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
export type TRoute$envs$get = {
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
                key: string;
                value: string;
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
export interface IController$envs {
    create<Method extends "post", QueryShape extends TRoute$envs$create["query"], ParamsShape extends TRoute$envs$create["params"], BodyShape extends TRoute$envs$create["body"], ReturnShape extends TResponseShape<any> = TRoute$envs$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<Method extends "patch", QueryShape extends TRoute$envs$update["query"], ParamsShape extends TRoute$envs$update["params"], BodyShape extends TRoute$envs$update["body"], ReturnShape extends TResponseShape<any> = TRoute$envs$update["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$envs$delete["query"], ParamsShape extends TRoute$envs$delete["params"], BodyShape extends TRoute$envs$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$envs$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$envs$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$envs$get["query"], ParamsShape extends TRoute$envs$get["params"], BodyShape extends TRoute$envs$get["body"], ReturnShape extends TResponseShape<any> = TRoute$envs$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const envsModule: (sdk: any) => IController$envs;
//# sourceMappingURL=envs.d.ts.map