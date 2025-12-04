import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$walletMonitoring$getAllNegative = {
    query: {
        olderThan?: Date;
        type?: string;
        currency?: string;
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
        id?: ObjectId;
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
                createdBy: ObjectId;
                account: ObjectId;
                type: string;
                currency: string;
                balance: number;
                lastBalance?: number;
                lastTxnReference?: string;
                negativeAt?: Date | null;
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
export type TRoute$walletMonitoring$getNegative = {
    query: {
        olderThan?: Date;
        type?: string;
        currency?: string;
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
        id?: ObjectId;
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
                createdBy: ObjectId;
                account: ObjectId;
                type: string;
                currency: string;
                balance: number;
                lastBalance?: number;
                lastTxnReference?: string;
                negativeAt?: Date | null;
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
export interface IController$walletMonitoring {
    getAllNegative(): TRequestExecutors<TRoute$walletMonitoring$getAllNegative["return"]>;
    getAllNegative<Method extends "get", QueryShape extends TRoute$walletMonitoring$getAllNegative["query"], ParamsShape extends TRoute$walletMonitoring$getAllNegative["params"], BodyShape extends TRoute$walletMonitoring$getAllNegative["body"], ReturnShape extends TResponseShape<any> = TRoute$walletMonitoring$getAllNegative["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    getNegative(): TRequestExecutors<TRoute$walletMonitoring$getNegative["return"]>;
    getNegative<Method extends "get", QueryShape extends TRoute$walletMonitoring$getNegative["query"], ParamsShape extends TRoute$walletMonitoring$getNegative["params"], BodyShape extends TRoute$walletMonitoring$getNegative["body"], ReturnShape extends TResponseShape<any> = TRoute$walletMonitoring$getNegative["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const walletMonitoringModule: (sdk: any) => IController$walletMonitoring;
//# sourceMappingURL=walletMonitoring.d.ts.map