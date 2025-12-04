import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$collaborators$update = {
    query: {};
    params: {
        id: string;
    };
    body: {
        role: string;
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$collaborators$delete = {
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
export type TRoute$collaborators$get = {
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
                createdFor: {
                    avatar?: {
                        _id?: ObjectId;
                        createdBy?: ObjectId;
                        name?: string;
                        url: string;
                        mimeType?: string;
                        sizeInBytes?: number;
                        alt?: string;
                    };
                    fname: string;
                    mname?: string;
                    lname?: string;
                    _id?: ObjectId;
                };
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                role?: string;
                isOwned: boolean;
                isPrimary: boolean;
                account: ObjectId;
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
export type TRoute$collaborators$create = {
    query: {};
    params: {
        token: string;
    };
    body: {};
    return: {
        status: boolean;
        data: {
            _id?: ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
            createdBy: ObjectId;
            createdFor: ObjectId;
            role?: string;
            isOwned: boolean;
            isPrimary: boolean;
            account: ObjectId;
            isBlocked?: boolean;
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
export type TRoute$collaborators$toggleBlocked = {
    query: {};
    params: {
        id: string;
        isBlocked: boolean;
    };
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export interface IController$collaborators {
    update<Method extends "patch", QueryShape extends TRoute$collaborators$update["query"], ParamsShape extends TRoute$collaborators$update["params"], BodyShape extends TRoute$collaborators$update["body"], ReturnShape extends TResponseShape<any> = TRoute$collaborators$update["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$collaborators$delete["query"], ParamsShape extends TRoute$collaborators$delete["params"], BodyShape extends TRoute$collaborators$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$collaborators$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$collaborators$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$collaborators$get["query"], ParamsShape extends TRoute$collaborators$get["params"], BodyShape extends TRoute$collaborators$get["body"], ReturnShape extends TResponseShape<any> = TRoute$collaborators$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<Method extends "post", QueryShape extends TRoute$collaborators$create["query"], ParamsShape extends TRoute$collaborators$create["params"], BodyShape extends TRoute$collaborators$create["body"], ReturnShape extends TResponseShape<any> = TRoute$collaborators$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    toggleBlocked<Method extends "patch", QueryShape extends TRoute$collaborators$toggleBlocked["query"], ParamsShape extends TRoute$collaborators$toggleBlocked["params"], BodyShape extends TRoute$collaborators$toggleBlocked["body"], ReturnShape extends TResponseShape<any> = TRoute$collaborators$toggleBlocked["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const collaboratorsModule: (sdk: any) => IController$collaborators;
//# sourceMappingURL=collaborators.d.ts.map