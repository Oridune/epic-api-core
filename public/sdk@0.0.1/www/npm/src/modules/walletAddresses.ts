import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";


    




export type TRoute$walletAddresses$create = {
    query: {},
    params: {},
    body: {
		name: string;
		accountName: string;
		address: string;
		lastTransferAmount?: number;
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		name: string;
		accountName: string;
		address: string;
		lastTransferAmount?: number;
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

    




export type TRoute$walletAddresses$update = {
    query: {},
    params: {
		id: ObjectId;
},
    body: {
		name?: string;
		accountName?: string;
		address?: string;
		lastTransferAmount?: number;
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy?: ObjectId;
		name?: string;
		accountName?: string;
		address?: string;
		lastTransferAmount?: number;
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

    




export type TRoute$walletAddresses$delete = {
    query: {},
    params: {
		id: ObjectId;
},
    body: {},
    return: { status: boolean; data: undefined },
};

    




export type TRoute$walletAddresses$get = {
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
		createdBy: ObjectId;
		name: string;
		accountName: string;
		address: string;
		lastTransferAmount?: number;
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


export interface IController$walletAddresses {


    create<
        Method extends "post",
        QueryShape extends TRoute$walletAddresses$create["query"],
        ParamsShape extends TRoute$walletAddresses$create["params"],
        BodyShape extends TRoute$walletAddresses$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$walletAddresses$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    update<
        Method extends "patch",
        QueryShape extends TRoute$walletAddresses$update["query"],
        ParamsShape extends TRoute$walletAddresses$update["params"],
        BodyShape extends TRoute$walletAddresses$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$walletAddresses$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    delete<
        Method extends "delete",
        QueryShape extends TRoute$walletAddresses$delete["query"],
        ParamsShape extends TRoute$walletAddresses$delete["params"],
        BodyShape extends TRoute$walletAddresses$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$walletAddresses$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    get(): TRequestExecutors<TRoute$walletAddresses$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$walletAddresses$get["query"],
        ParamsShape extends TRoute$walletAddresses$get["params"],
        BodyShape extends TRoute$walletAddresses$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$walletAddresses$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const walletAddressesModule = (sdk: any) => {
    const methods = {

    

        create(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("walletAddresses", "create");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/addresses"
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

                sdk.checkPermission("walletAddresses", "update");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/addresses/:id"
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

                sdk.checkPermission("walletAddresses", "delete");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/addresses/:id"
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

                sdk.checkPermission("walletAddresses", "get");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/addresses/:id?"
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


    } as IController$walletAddresses;


    


    (methods.create as any).__permission = "walletAddresses.create";


    


    (methods.update as any).__permission = "walletAddresses.update";


    


    (methods.delete as any).__permission = "walletAddresses.delete";


    


    (methods.get as any).__permission = "walletAddresses.get";



    return methods;
};