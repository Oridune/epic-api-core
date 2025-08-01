import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$accountInvites$create = {
    query: {};
    params: {};
    body: {
        recipient: string;
        role: string;
    };
    return: {
        status: boolean;
        data: {
            _id?: ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
            createdBy: ObjectId;
            recipient: string | string | string;
            role: string;
            account: ObjectId;
            token?: string;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    };
};
export type TRoute$accountInvites$delete = {
    query: {};
    params: {
        id: string;
    };
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$accountInvites$get = {
    query: {
        search?: string;
        range?: [Date, Date];
        offset?: number;
        limit?: number;
        sort?: /*(optional default:[object Object])*/ {} & {
            [K: string]: number;
        };
        project?: /*(optional)*/ {} & {
            [K: string]: number;
        };
        includeTotalCount?: boolean;
    };
    params: {
        id?: string;
    };
    body: {};
    return: {
        status: boolean;
        data: {
            totalCount?: number;
            results: Array<{
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                recipient: string | string | string;
                role: string;
                account: ObjectId;
                token?: string;
            }>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    };
};
export interface IController$accountInvites {
    create<Method extends "post", QueryShape extends TRoute$accountInvites$create["query"], ParamsShape extends TRoute$accountInvites$create["params"], BodyShape extends TRoute$accountInvites$create["body"], ReturnShape extends TResponseShape<any> = TRoute$accountInvites$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$accountInvites$delete["query"], ParamsShape extends TRoute$accountInvites$delete["params"], BodyShape extends TRoute$accountInvites$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$accountInvites$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$accountInvites$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$accountInvites$get["query"], ParamsShape extends TRoute$accountInvites$get["params"], BodyShape extends TRoute$accountInvites$get["body"], ReturnShape extends TResponseShape<any> = TRoute$accountInvites$get["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const accountInvitesModule: (sdk: any) => IController$accountInvites;
//# sourceMappingURL=accountInvites.d.ts.map