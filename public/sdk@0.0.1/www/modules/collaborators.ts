import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";


    




export type TRoute$collaborators$update = {
    query: {},
    params: {
		id: string;
},
    body: {
		role: string;
},
    return: { status: boolean; data: undefined },
};

    




export type TRoute$collaborators$delete = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: { status: boolean; data: undefined },
};

    




export type TRoute$collaborators$get = {
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
		createdFor: {
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		fname: string;
		mname?: string;
		lname?: string;
		_id?: ObjectId;
};
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		role?: string;
		isOwned: boolean;
		isPrimary: boolean;
		account: ObjectId;
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

    




export type TRoute$collaborators$create = {
    query: {},
    params: {
		token: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
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

    




export type TRoute$collaborators$toggleBlocked = {
    query: {},
    params: {
		id: string;
		isBlocked: boolean;
},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$collaborators {


    update<
        Method extends "patch",
        QueryShape extends TRoute$collaborators$update["query"],
        ParamsShape extends TRoute$collaborators$update["params"],
        BodyShape extends TRoute$collaborators$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$collaborators$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    delete<
        Method extends "delete",
        QueryShape extends TRoute$collaborators$delete["query"],
        ParamsShape extends TRoute$collaborators$delete["params"],
        BodyShape extends TRoute$collaborators$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$collaborators$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    get(): TRequestExecutors<TRoute$collaborators$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$collaborators$get["query"],
        ParamsShape extends TRoute$collaborators$get["params"],
        BodyShape extends TRoute$collaborators$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$collaborators$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    create<
        Method extends "post",
        QueryShape extends TRoute$collaborators$create["query"],
        ParamsShape extends TRoute$collaborators$create["params"],
        BodyShape extends TRoute$collaborators$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$collaborators$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    toggleBlocked<
        Method extends "patch",
        QueryShape extends TRoute$collaborators$toggleBlocked["query"],
        ParamsShape extends TRoute$collaborators$toggleBlocked["params"],
        BodyShape extends TRoute$collaborators$toggleBlocked["body"],
        ReturnShape extends TResponseShape<any> = TRoute$collaborators$toggleBlocked["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const collaboratorsModule = (sdk: any) => {
    const methods = {

    

        update(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("collaborators", "update");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/collaborators/:id"
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

                sdk.checkPermission("collaborators", "delete");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/collaborators/:id"
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

                sdk.checkPermission("collaborators", "get");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/collaborators/:id?"
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

                sdk.checkPermission("collaborators", "create");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/collaborators/:token"
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


    

        toggleBlocked(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("collaborators", "toggleBlocked");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/collaborators/toggle/blocked/:id/:isBlocked"
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


    } as IController$collaborators;


    


    (methods.update as any).__permission = "collaborators.update";


    


    (methods.delete as any).__permission = "collaborators.delete";


    


    (methods.get as any).__permission = "collaborators.get";


    


    (methods.create as any).__permission = "collaborators.create";


    


    (methods.toggleBlocked as any).__permission = "collaborators.toggleBlocked";



    return methods;
};