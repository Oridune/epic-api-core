import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$adminPlugins$toggleEnable = {
    query: {},
    params: {},
    body: {
		name: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$adminPlugins$list = {
    query: {},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$adminPlugins$add = {
    query: {},
    params: {},
    body: {
		source: string;
		name: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$adminPlugins$delete = {
    query: {},
    params: {
		name: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$adminPlugins {
    toggleEnable<
        Method extends "patch",
        QueryShape extends TRoute$adminPlugins$toggleEnable["query"],
        ParamsShape extends TRoute$adminPlugins$toggleEnable["params"],
        BodyShape extends TRoute$adminPlugins$toggleEnable["body"],
        ReturnShape extends TResponseShape<any> = TRoute$adminPlugins$toggleEnable["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    list(): TRequestExecutors<TRoute$adminPlugins$list["return"]>;
    list<
        Method extends "get",
        QueryShape extends TRoute$adminPlugins$list["query"],
        ParamsShape extends TRoute$adminPlugins$list["params"],
        BodyShape extends TRoute$adminPlugins$list["body"],
        ReturnShape extends TResponseShape<any> = TRoute$adminPlugins$list["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    add<
        Method extends "post",
        QueryShape extends TRoute$adminPlugins$add["query"],
        ParamsShape extends TRoute$adminPlugins$add["params"],
        BodyShape extends TRoute$adminPlugins$add["body"],
        ReturnShape extends TResponseShape<any> = TRoute$adminPlugins$add["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$adminPlugins$delete["query"],
        ParamsShape extends TRoute$adminPlugins$delete["params"],
        BodyShape extends TRoute$adminPlugins$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$adminPlugins$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const adminPluginsModule = (sdk: any): IController$adminPlugins => ({

    toggleEnable(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("adminPlugins", "toggleEnable");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/admin/plugins/toggle/plugin"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    list(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("adminPlugins", "list");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/admin/plugins"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    add(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("adminPlugins", "add");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/admin/plugins"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("adminPlugins", "delete");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/admin/plugins/:name"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});