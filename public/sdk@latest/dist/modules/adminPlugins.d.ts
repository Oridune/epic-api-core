import type { TRequestOptions, TRequestExecutors } from "../types";
export interface IController$adminPlugins {
    toggleEnable<Method extends "patch", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        name: string;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    list(): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }>;
    list<Method extends "get", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    add<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        source: string;
        name: string;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    delete<Method extends "delete", QueryShape extends {}, ParamsShape extends {
        name: string;
    }, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
}
export declare const adminPluginsModule: (sdk: any) => IController$adminPlugins;
