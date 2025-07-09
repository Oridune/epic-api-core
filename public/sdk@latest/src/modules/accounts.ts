import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$accounts$updateLogo = {
    query: {},
    params: {},
    body: {
		token: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$accounts$create = {
    query: {},
    params: {},
    body: {
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
},
    return: {
		status: boolean;
		data: {
		account: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		isBlocked?: boolean;
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
};
		collaborator: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		role?: string;
		isOwned: boolean;
		isPrimary: boolean;
		account: ObjectId;
		isBlocked?: boolean;
};
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




export type TRoute$accounts$update = {
    query: {},
    params: {
		id: string;
},
    body: {
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$accounts$delete = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$accounts$get = {
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
		createdBy: ObjectId;
		createdFor: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		isBlocked?: boolean;
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
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




export type TRoute$accounts$toggleBlocked = {
    query: {},
    params: {
		id: string;
		isBlocked: boolean;
},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$accounts {
    updateLogo(): TRequestExecutors<TRoute$accounts$updateLogo["return"]>;
    updateLogo<
        Method extends "get",
        QueryShape extends TRoute$accounts$updateLogo["query"],
        ParamsShape extends TRoute$accounts$updateLogo["params"],
        BodyShape extends TRoute$accounts$updateLogo["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$updateLogo["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updateLogo<
        Method extends "put",
        QueryShape extends TRoute$accounts$updateLogo["query"],
        ParamsShape extends TRoute$accounts$updateLogo["params"],
        BodyShape extends TRoute$accounts$updateLogo["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$updateLogo["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<
        Method extends "post",
        QueryShape extends TRoute$accounts$create["query"],
        ParamsShape extends TRoute$accounts$create["params"],
        BodyShape extends TRoute$accounts$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<
        Method extends "patch",
        QueryShape extends TRoute$accounts$update["query"],
        ParamsShape extends TRoute$accounts$update["params"],
        BodyShape extends TRoute$accounts$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$accounts$delete["query"],
        ParamsShape extends TRoute$accounts$delete["params"],
        BodyShape extends TRoute$accounts$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$accounts$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$accounts$get["query"],
        ParamsShape extends TRoute$accounts$get["params"],
        BodyShape extends TRoute$accounts$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    toggleBlocked<
        Method extends "patch",
        QueryShape extends TRoute$accounts$toggleBlocked["query"],
        ParamsShape extends TRoute$accounts$toggleBlocked["params"],
        BodyShape extends TRoute$accounts$toggleBlocked["body"],
        ReturnShape extends TResponseShape<any> = TRoute$accounts$toggleBlocked["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const accountsModule = (sdk: any): IController$accounts => ({

    updateLogo(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "updateLogo");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts/logo/:account"
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

    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "create");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    update(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "update");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts/:id"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "delete");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts/:id"
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

    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "get");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts/:id?"
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

    toggleBlocked(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accounts", "toggleBlocked");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/accounts/toggle/blocked/:id/:isBlocked"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});