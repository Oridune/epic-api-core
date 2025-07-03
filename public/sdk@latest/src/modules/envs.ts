import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$envs$create = {
    query: {},
    params: {},
    body: {
		key: string;
		value: string;
		ttl?: number;
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		key: string;
		value: string;
		ttl?: number;
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




export type TRoute$envs$update = {
    query: {},
    params: {
		id: string;
},
    body: {
		key?: string;
		value?: string;
		ttl?: number;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$envs$delete = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$envs$get = {
    query: {
		search?: string;
		range?: [Date,Date];
		offset?: number;
		limit?: number;
		sort?: /*(optional default:[object Object])*/{
} & { [K: string]: number }
;
		project?: /*(optional)*/{
} & { [K: string]: number }
;
		includeTotalCount?: boolean;
},
    params: {
		id?: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		totalCount?: number;
		results: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		key: string;
		value: string;
		ttl?: number;
}>;
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


export interface IController$envs {
    create<
        Method extends "post",
        QueryShape extends TRoute$envs$create["query"],
        ParamsShape extends TRoute$envs$create["params"],
        BodyShape extends TRoute$envs$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$envs$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<
        Method extends "patch",
        QueryShape extends TRoute$envs$update["query"],
        ParamsShape extends TRoute$envs$update["params"],
        BodyShape extends TRoute$envs$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$envs$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$envs$delete["query"],
        ParamsShape extends TRoute$envs$delete["params"],
        BodyShape extends TRoute$envs$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$envs$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$envs$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$envs$get["query"],
        ParamsShape extends TRoute$envs$get["params"],
        BodyShape extends TRoute$envs$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$envs$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const envsModule = (sdk: any): IController$envs => ({

    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "create");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/envs/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    update(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "update");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "delete");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "get");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/envs/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});