import type { TRequestOptions, TRequestExecutors, TResponseShape } from "../types";
export type TRoute$uploads$sign = {
    query: {
        name?: string;
        alt?: string;
        contentType: string;
        contentLength: number;
    } & {
        [K: string]: any;
    };
    params: {} & {
        [K: string]: string;
    };
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$uploads$upload = {
    query: {};
    params: {};
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export interface IController$uploads {
    sign(): TRequestExecutors<TRoute$uploads$sign["return"]>;
    sign<Method extends "get", QueryShape extends TRoute$uploads$sign["query"], ParamsShape extends TRoute$uploads$sign["params"], BodyShape extends TRoute$uploads$sign["body"], ReturnShape extends TResponseShape<any> = TRoute$uploads$sign["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload(): TRequestExecutors<TRoute$uploads$upload["return"]>;
    upload<Method extends "get", QueryShape extends TRoute$uploads$upload["query"], ParamsShape extends TRoute$uploads$upload["params"], BodyShape extends TRoute$uploads$upload["body"], ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload<Method extends "delete", QueryShape extends TRoute$uploads$upload["query"], ParamsShape extends TRoute$uploads$upload["params"], BodyShape extends TRoute$uploads$upload["body"], ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload<Method extends "put", QueryShape extends TRoute$uploads$upload["query"], ParamsShape extends TRoute$uploads$upload["params"], BodyShape extends TRoute$uploads$upload["body"], ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const uploadsModule: (sdk: any) => IController$uploads;
