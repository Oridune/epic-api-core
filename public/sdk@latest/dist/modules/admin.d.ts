import type { TRequestOptions, TRequestExecutors } from "../types";
export interface IController$admin {
    updateCore<Method extends "patch", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        template?: string;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
}
export declare const adminModule: (sdk: any) => IController$admin;
