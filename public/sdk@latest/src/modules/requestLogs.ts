import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$requestLogs$create = {
    query: {},
    params: {},
    body: {
		namespace?: string;
		requestId: string;
		method: string;
		url: string;
		headers: {
} & { [K: string]: string }
;
		body?: any;
		auth?: /*(optional)*/{
		secretId?: string;
		sessionId?: string;
		userId?: string;
		accountId?: string;
		isAccountOwned?: boolean;
		isAccountPrimary?: boolean;
		role?: string;
		accountRole?: string;
		resolvedRole?: string;
};
		responseStatus: number;
		response?: /*(optional)*/{
		status: boolean;
		messages?: any;
		data?: any;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
		errorStack?: any;
		metrics: {
} & { [K: string]: any }
;
};
		errorStack?: any;
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		createdBy?: ObjectId;
		account?: ObjectId;
		namespace?: string;
		requestId: string;
		method: string;
		url: string;
		headers: {
} & { [K: string]: string }
;
		body?: any;
		auth?: /*(optional)*/{
		secretId?: string;
		sessionId?: string;
		userId?: string;
		accountId?: string;
		isAccountOwned?: boolean;
		isAccountPrimary?: boolean;
		role?: string;
		accountRole?: string;
		resolvedRole?: string;
};
		responseStatus: number;
		response?: /*(optional)*/{
		status: boolean;
		messages?: any;
		data?: any;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
		errorStack?: any;
		metrics: {
} & { [K: string]: any }
;
};
		errorStack?: any;
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




export type TRoute$requestLogs$delete = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$requestLogs$get = {
    query: {
		namespace?: string;
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
		filters?: /*(optional)*/{
} & { [K: string]: string | number | boolean }
;
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
		createdBy?: ObjectId;
		account?: ObjectId;
		namespace?: string;
		requestId: string;
		method: string;
		url: string;
		headers: {
} & { [K: string]: string }
;
		body?: any;
		auth?: /*(optional)*/{
		secretId?: string;
		sessionId?: string;
		userId?: string;
		accountId?: string;
		isAccountOwned?: boolean;
		isAccountPrimary?: boolean;
		role?: string;
		accountRole?: string;
		resolvedRole?: string;
};
		responseStatus: number;
		response?: /*(optional)*/{
		status: boolean;
		messages?: any;
		data?: any;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
		errorStack?: any;
		metrics: {
} & { [K: string]: any }
;
};
		errorStack?: any;
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


export interface IController$requestLogs {
    create<
        Method extends "post",
        QueryShape extends TRoute$requestLogs$create["query"],
        ParamsShape extends TRoute$requestLogs$create["params"],
        BodyShape extends TRoute$requestLogs$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogs$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$requestLogs$delete["query"],
        ParamsShape extends TRoute$requestLogs$delete["params"],
        BodyShape extends TRoute$requestLogs$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogs$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$requestLogs$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$requestLogs$get["query"],
        ParamsShape extends TRoute$requestLogs$get["params"],
        BodyShape extends TRoute$requestLogs$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$requestLogs$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const requestLogsModule = (sdk: any): IController$requestLogs => ({

    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("requestLogs", "create");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/logs"
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

    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("requestLogs", "delete");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/logs/:id"
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

            sdk.checkPermission("requestLogs", "get");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/request/logs/:id?"
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