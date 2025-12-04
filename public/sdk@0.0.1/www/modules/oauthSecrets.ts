import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";


    




export type TRoute$oauthSecrets$createFor = {
    query: {},
    params: {},
    body: {
		userId: string;
		name: string;
		scopes?: /*(optional)*/{
} & { [K: string]: Array<string> }
 | Array<string>;
		ttl?: number;
},
    return: {
		status: boolean;
		data: {
		secret: {
		issuer: string;
		type: string;
		token: string;
		expiresAtSeconds: number;
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

    




export type TRoute$oauthSecrets$create = {
    query: {},
    params: {},
    body: {
		name: string;
		scopes?: /*(optional)*/{
} & { [K: string]: Array<string> }
 | Array<string>;
		ttl?: number;
},
    return: {
		status: boolean;
		data: {
		secret: {
		issuer: string;
		type: string;
		token: string;
		expiresAtSeconds: number;
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

    




export type TRoute$oauthSecrets$delete = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};

    




export type TRoute$oauthSecrets$get = {
    query: {
		search?: string;
		filters?: /*(optional)*/{
} & { [K: string]: {
		$not: {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
};
} | {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
} }
 | /*(optional)*/{
		$and?: Array<{
} & { [K: string]: {
		$not: {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
};
} | {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
} }
>;
		$or?: Array<{
} & { [K: string]: {
		$not: {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
};
} | {
		$eq?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$ne?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$in?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$nin?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$all?: Array<{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string>;
		$lt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$lte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gt?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$gte?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
		$mod?: [number,number];
		$regex?: /*(optional)*/{
		type: "string" | "number" | "boolean" | "objectId" | "date" | "regex";
		value: string;
		options?: /*(optional)*/{
		regexFlags?: string;
};
} | string;
} }
>;
};
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
		expiresAt?: Date;
		createdBy: ObjectId;
		oauthApp: ObjectId;
		name: string;
		scopes?: /*(optional)*/{
} & { [K: string]: Array<string> }
;
		isBlocked?: boolean;
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


export interface IController$oauthSecrets {


    createFor<
        Method extends "post",
        QueryShape extends TRoute$oauthSecrets$createFor["query"],
        ParamsShape extends TRoute$oauthSecrets$createFor["params"],
        BodyShape extends TRoute$oauthSecrets$createFor["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$createFor["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    create<
        Method extends "post",
        QueryShape extends TRoute$oauthSecrets$create["query"],
        ParamsShape extends TRoute$oauthSecrets$create["params"],
        BodyShape extends TRoute$oauthSecrets$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    delete<
        Method extends "delete",
        QueryShape extends TRoute$oauthSecrets$delete["query"],
        ParamsShape extends TRoute$oauthSecrets$delete["params"],
        BodyShape extends TRoute$oauthSecrets$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    get(): TRequestExecutors<TRoute$oauthSecrets$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$oauthSecrets$get["query"],
        ParamsShape extends TRoute$oauthSecrets$get["params"],
        BodyShape extends TRoute$oauthSecrets$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthSecrets$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const oauthSecretsModule = (sdk: any) => {
    const methods = {

    

        createFor(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthSecrets", "createFor");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/oauth/secrets/behalf"
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


    

        create(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthSecrets", "create");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/oauth/secrets"
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


    

        delete(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthSecrets", "delete");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/oauth/secrets/:id"
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

                sdk.checkPermission("oauthSecrets", "get");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/oauth/secrets/:id?"
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


    } as IController$oauthSecrets;


    


    (methods.createFor as any).__permission = "oauthSecrets.createFor";


    


    (methods.create as any).__permission = "oauthSecrets.create";


    


    (methods.delete as any).__permission = "oauthSecrets.delete";


    


    (methods.get as any).__permission = "oauthSecrets.get";



    return methods;
};