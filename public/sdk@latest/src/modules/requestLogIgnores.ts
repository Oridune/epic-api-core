import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$requestLogIgnores$create = {
    query: {},
    params: {},
    body: {
		method?: Array<string>;
		url?: string;
		responseStatus?: [number,number];
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy?: ObjectId;
		account?: ObjectId;
		method?: Array<string>;
		url?: string;
		responseStatus?: [number,number];
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




export type TRoute$requestLogIgnores$update = {
    query: {},
    params: {
		id: ObjectId;
},
    body: {
		method?: Array<string>;
		url?: string;
		responseStatus?: [number,number];
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy?: ObjectId;
		account?: ObjectId;
		method?: Array<string>;
		url?: string;
		responseStatus?: [number,number];
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




export type TRoute$requestLogIgnores$delete = {
    query: {},
    params: {
		id: ObjectId;
},
    body: {},
    return: {
		status: boolean;
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




export type TRoute$requestLogIgnores$get = {
    query: {
		search?: string;
		range?: [Date,Date];
		offset?: number;
		limit?: number;
		sort?: /*(optional default:[object Object]) Provide a sorting information in mongodb sort object format*/{
} & { [K: string]: number }
;
		project?: /*(optional) Provide a projection information in mongodb project object format*/{
} & { [K: string]: number }
;
		includeTotalCount?: boolean;
},
    params: {
		id?: ObjectId;
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
		createdBy?: ObjectId;
		account?: ObjectId;
		method?: Array<string>;
		url?: string;
		responseStatus?: [number,number];
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


export interface IController$requestLogIgnores {
    create<
        Method extends "post",
        QueryShape extends TRoute$requestLogIgnores$create["query"],
        ParamsShape extends TRoute$requestLogIgnores$create["params"],
        BodyShape extends TRoute$requestLogIgnores$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogIgnores$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<
        Method extends "patch",
        QueryShape extends TRoute$requestLogIgnores$update["query"],
        ParamsShape extends TRoute$requestLogIgnores$update["params"],
        BodyShape extends TRoute$requestLogIgnores$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogIgnores$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$requestLogIgnores$delete["query"],
        ParamsShape extends TRoute$requestLogIgnores$delete["params"],
        BodyShape extends TRoute$requestLogIgnores$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogIgnores$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$requestLogIgnores$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$requestLogIgnores$get["query"],
        ParamsShape extends TRoute$requestLogIgnores$get["params"],
        BodyShape extends TRoute$requestLogIgnores$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogIgnores$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const requestLogIgnoresModule = (sdk: any): IController$requestLogIgnores => ({

    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("requestLogIgnores", "create");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/log/ignores"
            ).replace(/:\w+\?\//g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url,
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

            sdk.checkPermission("requestLogIgnores", "update");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/log/ignores/:id"
            ).replace(/:\w+\?\//g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
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

            sdk.checkPermission("requestLogIgnores", "delete");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/log/ignores/:id"
            ).replace(/:\w+\?\//g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url,
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

            sdk.checkPermission("requestLogIgnores", "get");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/log/ignores/:id?"
            ).replace(/:\w+\?\//g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});