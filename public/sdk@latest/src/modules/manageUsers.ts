import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$manageUsers$updatePassword = {
    query: {},
    params: {
		id: ObjectId;
},
    body: {
		password: string;
		hashedPassword?: any;
},
    return: { status: boolean; data: undefined },
};


export interface IController$manageUsers {
    updatePassword<
        Method extends "put",
        QueryShape extends TRoute$manageUsers$updatePassword["query"],
        ParamsShape extends TRoute$manageUsers$updatePassword["params"],
        BodyShape extends TRoute$manageUsers$updatePassword["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageUsers$updatePassword["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
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
        }, data);
    },

});