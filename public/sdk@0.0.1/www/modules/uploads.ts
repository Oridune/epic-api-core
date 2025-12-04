import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";


    




export type TRoute$uploads$sign = {
    query: {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		method: string;
		url?: string;
		getUrl: string;
		expiresInSeconds: number;
		token: string;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics?: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
},
};

    




export type TRoute$uploads$upload = {
    query: {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		method: string;
		url?: string;
		getUrl: string;
		expiresInSeconds: number;
		token: string;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics?: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
},
};




export type TRoute$uploads$uploadDELETE = {
    query: {},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$uploads$uploadPUT = {
    query: {},
    params: {},
    body: {
		token: string;
},
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
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    uploadDELETE<
        Method extends "delete",
        QueryShape extends TRoute$uploads$uploadDELETE["query"],
        ParamsShape extends TRoute$uploads$uploadDELETE["params"],
        BodyShape extends TRoute$uploads$uploadDELETE["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$uploadDELETE["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    uploadPUT<
        Method extends "put",
        QueryShape extends TRoute$uploads$uploadPUT["query"],
        ParamsShape extends TRoute$uploads$uploadPUT["params"],
        BodyShape extends TRoute$uploads$uploadPUT["body"],
        ReturnShape extends TResponseShape<any> = TRoute$uploads$uploadPUT["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const uploadsModule = (sdk: any) => {
    const methods = {

    

        sign(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("uploads", "sign");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/uploads/sign"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "get" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },


    

        upload(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("uploads", "upload");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/uploads"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "get" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },
        uploadDELETE(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("uploads", "uploadDELETE");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/uploads"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "delete" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },
        uploadPUT(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("uploads", "uploadPUT");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/uploads"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "put" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },


    } as IController$uploads;


    


    (methods.sign as any).__permission = "uploads.sign";


    


    (methods.upload as any).__permission = "uploads.upload";

    (methods.uploadDELETE as any).__permission = "uploads.uploadDELETE";

    (methods.uploadPUT as any).__permission = "uploads.uploadPUT";



    return methods;
};