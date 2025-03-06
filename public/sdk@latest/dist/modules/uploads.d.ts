import type { TRequestOptions, TRequestExecutors } from "../types";
export interface IController$uploads {
    sign(): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }>;
    sign<Method extends "get", QueryShape extends {
        name?: string;
        alt?: string;
        contentType: string;
        contentLength: number;
    } & {
        [K: string]: any;
    }, ParamsShape extends {} & {
        [K: string]: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    upload(): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }>;
    upload<Method extends "get", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    upload<Method extends "delete", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    upload<Method extends "put", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
}
export declare const uploadsModule: (sdk: any) => IController$uploads;
