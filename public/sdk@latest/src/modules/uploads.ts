import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$uploads$sign = {
    query: {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
    params: {
} & { [K: string]: string }
,
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$uploads$upload = {
    query: {},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$uploads {
    sign(): TRequestExecutors<TRoute$uploads$sign["return"]>;
    sign<
        Method extends "get",
        QueryShape extends TRoute$uploads$sign["query"],
        ParamsShape extends TRoute$uploads$sign["params"],
        BodyShape extends TRoute$uploads$sign["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$sign["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload(): TRequestExecutors<TRoute$uploads$upload["return"]>;
    upload<
        Method extends "get",
        QueryShape extends TRoute$uploads$upload["query"],
        ParamsShape extends TRoute$uploads$upload["params"],
        BodyShape extends TRoute$uploads$upload["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload<
        Method extends "delete",
        QueryShape extends TRoute$uploads$upload["query"],
        ParamsShape extends TRoute$uploads$upload["params"],
        BodyShape extends TRoute$uploads$upload["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    upload<
        Method extends "put",
        QueryShape extends TRoute$uploads$upload["query"],
        ParamsShape extends TRoute$uploads$upload["params"],
        BodyShape extends TRoute$uploads$upload["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$upload["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const uploadsModule = (sdk: any): IController$uploads => ({

    sign(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("uploads", "sign");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/sign/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    upload(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("uploads", "upload");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});