import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





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
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const adminModule = (sdk: any): IController$admin => ({

    updateCore(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("admin", "updateCore");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/admin/core/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});