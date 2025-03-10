import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";
export interface IController$manageWallets {
    balanceList<Method extends "post", QueryShape extends {}, ParamsShape extends {
        accountId: string;
    }, BodyShape extends {
        types?: Array<string>;
        currencies?: Array<string>;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: Array<{
            _id?: ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
            account: ObjectId;
            type: string;
            currency: string;
            balance: number;
            digest: string;
            lastBalance?: number;
            lastTxnReference?: string;
        }>;
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
    getAll(): TRequestExecutors<{
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                account: ObjectId;
                type: string;
                currency: string;
                balance: number;
                digest: string;
                lastBalance?: number;
                lastTxnReference?: string;
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
    getAll<Method extends "get", QueryShape extends {
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
                account: ObjectId;
                type: string;
                currency: string;
                balance: number;
                digest: string;
                lastBalance?: number;
                lastTxnReference?: string;
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
    refund<Method extends "delete", QueryShape extends {}, ParamsShape extends {
        id: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            transaction: {
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                sessionId?: string;
                reference: string;
                foreignRefType?: string;
                foreignRef?: string;
                fromName: string;
                from: ObjectId;
                sender: ObjectId;
                toName: string;
                to: ObjectId;
                receiver: ObjectId;
                type: string;
                description: (/*(optional)*/ {} & {
                    [K: string]: string;
                }) | string;
                tags?: Array<string>;
                currency: string;
                amount: number;
                methodOf3DSecurity?: string;
                status: string;
                isRefund?: boolean;
                isRefunded?: boolean;
                metadata?: /*(optional)*/ {} & {
                    [K: string]: number | boolean | string;
                };
            };
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
    charge<Method extends "post", QueryShape extends {}, ParamsShape extends {
        type?: string;
        currency?: string;
    }, BodyShape extends {
        payer: string;
        amount: number;
        description?: string;
        metadata?: /*(optional)*/ {} & {
            [K: string]: number | boolean | string;
        };
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            transaction: {
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                sessionId?: string;
                reference: string;
                foreignRefType?: string;
                foreignRef?: string;
                fromName: string;
                from: ObjectId;
                sender: ObjectId;
                toName: string;
                to: ObjectId;
                receiver: ObjectId;
                type: string;
                description: (/*(optional)*/ {} & {
                    [K: string]: string;
                }) | string;
                tags?: Array<string>;
                currency: string;
                amount: number;
                methodOf3DSecurity?: string;
                status: string;
                isRefund?: boolean;
                isRefunded?: boolean;
                metadata?: /*(optional)*/ {} & {
                    [K: string]: number | boolean | string;
                };
            };
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
    transactions(): TRequestExecutors<{
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                sessionId?: string;
                reference: string;
                foreignRefType?: string;
                foreignRef?: string;
                fromName: string;
                from: ObjectId;
                sender: ObjectId;
                toName: string;
                to: ObjectId;
                receiver: ObjectId;
                type: string;
                description: (/*(optional)*/ {} & {
                    [K: string]: string;
                }) | string;
                tags?: Array<string>;
                currency: string;
                amount: number;
                methodOf3DSecurity?: string;
                status: string;
                isRefund?: boolean;
                isRefunded?: boolean;
                metadata?: /*(optional)*/ {} & {
                    [K: string]: number | boolean | string;
                };
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
    transactions<Method extends "get", QueryShape extends {
        search?: string;
        sent?: boolean;
        received?: boolean;
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
        accountId: string;
        type?: string;
        currency?: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                sessionId?: string;
                reference: string;
                foreignRefType?: string;
                foreignRef?: string;
                fromName: string;
                from: ObjectId;
                sender: ObjectId;
                toName: string;
                to: ObjectId;
                receiver: ObjectId;
                type: string;
                description: (/*(optional)*/ {} & {
                    [K: string]: string;
                }) | string;
                tags?: Array<string>;
                currency: string;
                amount: number;
                methodOf3DSecurity?: string;
                status: string;
                isRefund?: boolean;
                isRefunded?: boolean;
                metadata?: /*(optional)*/ {} & {
                    [K: string]: number | boolean | string;
                };
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
export declare const manageWalletsModule: (sdk: any) => IController$manageWallets;
