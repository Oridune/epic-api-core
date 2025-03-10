import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$admin {
    
                
            updateCore<
        Method extends "patch",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		template?: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
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
        });
    },
    
});