import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$uploads {
    
                
            sign(): TRequestExecutors<
        { status: boolean; data: undefined }
    >;
        sign<
        Method extends "get",
        QueryShape extends {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
        ParamsShape extends {
} & { [K: string]: string }
,
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            upload(): TRequestExecutors<
        { status: boolean; data: undefined }
    >;
        upload<
        Method extends "get",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
            upload<
        Method extends "delete",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
            upload<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        }

export const uploadsModule = (sdk: any): IController$uploads => ({
    
    sign(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("uploads", "sign");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/sign/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    upload(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("uploads", "upload");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});