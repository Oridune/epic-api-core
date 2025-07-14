import type { TRequestOptions, TRequestExecutors, TResponseShape } from "../types";
export type TRoute$batcher$request = {
    query: {};
    params: {};
    body: {
        requests: Array<Array<{
            endpoint?: string;
            method: "get" | "post" | "patch" | "put" | "delete" | "options";
            headers?: /*(optional)*/ {} & {
                [K: string]: string;
            };
            body?: any;
            disabled?: boolean;
        } | string> | {
            endpoint?: string;
            method: "get" | "post" | "patch" | "put" | "delete" | "options";
            headers?: /*(optional)*/ {} & {
                [K: string]: string;
            };
            body?: any;
            disabled?: boolean;
        } | string>;
    };
    return: {
        status: boolean;
        data: {
            responses: Array<any | undefined>;
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
export interface IController$batcher {
    request<Method extends "post", QueryShape extends TRoute$batcher$request["query"], ParamsShape extends TRoute$batcher$request["params"], BodyShape extends TRoute$batcher$request["body"], ReturnShape extends TResponseShape<any> = TRoute$batcher$request["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const batcherModule: (sdk: any) => IController$batcher;
