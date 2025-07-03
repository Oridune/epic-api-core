import type { TRequestOptions, TRequestExecutors, TResponseShape } from "../types";
export type TRoute$usersIdentification$methods = {
    query: {};
    params: {};
    body: {};
    return: {
        status: boolean;
        data: {
            availableMethods: Array<{
                type: string;
                value: string;
                verified: boolean;
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
export type TRoute$usersIdentification$publicMethods = {
    query: {};
    params: {
        username: string;
    };
    body: {};
    return: {
        status: boolean;
        data: {
            availableMethods: Array<{
                type: string;
                maskedValue: string;
                verified: boolean;
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
export type TRoute$usersIdentification$request = {
    query: {};
    params: {
        purpose: string;
        username: string;
        method: string;
    };
    body: {};
    return: {
        status: boolean;
        data: {
            token: string;
            otp?: number;
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
export interface IController$usersIdentification {
    methods(): TRequestExecutors<TRoute$usersIdentification$methods["return"]>;
    methods<Method extends "get", QueryShape extends TRoute$usersIdentification$methods["query"], ParamsShape extends TRoute$usersIdentification$methods["params"], BodyShape extends TRoute$usersIdentification$methods["body"], ReturnShape extends TResponseShape<any> = TRoute$usersIdentification$methods["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    publicMethods(): TRequestExecutors<TRoute$usersIdentification$publicMethods["return"]>;
    publicMethods<Method extends "get", QueryShape extends TRoute$usersIdentification$publicMethods["query"], ParamsShape extends TRoute$usersIdentification$publicMethods["params"], BodyShape extends TRoute$usersIdentification$publicMethods["body"], ReturnShape extends TResponseShape<any> = TRoute$usersIdentification$publicMethods["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    request(): TRequestExecutors<TRoute$usersIdentification$request["return"]>;
    request<Method extends "get", QueryShape extends TRoute$usersIdentification$request["query"], ParamsShape extends TRoute$usersIdentification$request["params"], BodyShape extends TRoute$usersIdentification$request["body"], ReturnShape extends TResponseShape<any> = TRoute$usersIdentification$request["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const usersIdentificationModule: (sdk: any) => IController$usersIdentification;
