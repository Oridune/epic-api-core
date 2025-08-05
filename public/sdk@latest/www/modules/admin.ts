import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";





export type TRoute$admin$updateCore = {
    query: {},
    params: {},
    body: {
		template?: string;
},
    return: { status: boolean; data: undefined },
};


export interface IController$admin {
    updateCore<
        Method extends "patch",
        QueryShape extends TRoute$admin$updateCore["query"],
        ParamsShape extends TRoute$admin$updateCore["params"],
        BodyShape extends TRoute$admin$updateCore["body"],
        ReturnShape extends TResponseShape<any> = TRoute$admin$updateCore["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const adminModule = (sdk: any) => {
    const methods = {

        updateCore(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("admin", "updateCore");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/admin/core"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "patch" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },

    } as IController$admin;


    (methods.updateCore as any).__permission = "admin.updateCore";


    return methods;
};