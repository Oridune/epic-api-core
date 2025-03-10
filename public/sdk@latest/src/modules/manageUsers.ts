import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$manageUsers {
    
                
            updatePassword<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {
		id: ObjectId;
},
        BodyShape extends {
		password: string;
		hashedPassword: any;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        }

export const manageUsersModule = (sdk: any): IController$manageUsers => ({
    
    updatePassword(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageUsers", "updatePassword");

            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/manage/users/password/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});