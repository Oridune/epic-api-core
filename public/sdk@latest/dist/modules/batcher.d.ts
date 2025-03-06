import type { TRequestOptions, TRequestExecutors } from "../types";
export interface IController$batcher {
    request<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        requests: Array<Array<{
            endpoint?: string;
            method: string;
            headers?: /*(optional)*/ {} & {
                [K: string]: string;
            };
            body?: any;
            disabled?: boolean;
        } | string> | {
            endpoint?: string;
            method: string;
            headers?: /*(optional)*/ {} & {
                [K: string]: string;
            };
            body?: any;
            disabled?: boolean;
        } | string>;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            responses: Array<any>;
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
export declare const batcherModule: (sdk: any) => IController$batcher;
