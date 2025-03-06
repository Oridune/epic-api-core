import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";
export interface IController$manageUsers {
    updatePassword<Method extends "put", QueryShape extends {}, ParamsShape extends {
        id: ObjectId;
    }, BodyShape extends {
        password: string;
        hashedPassword: any;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
}
export declare const manageUsersModule: (sdk: any) => IController$manageUsers;
