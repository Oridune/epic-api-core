import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";


    




export type TRoute$manageWallets$balanceList = {
    query: {},
    params: {
		accountId: string;
},
    body: {
		types?: Array<string>;
		currencies?: Array<string>;
},
    return: {
		status: boolean;
		data: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		digest: string;
		lastBalance?: number;
		lastTxnReference?: string;
		negativeAt?: Date | null;
}>;
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

    




export type TRoute$manageWallets$getAll = {
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
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		digest: string;
		lastBalance?: number;
		lastTxnReference?: string;
		negativeAt?: Date | null;
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

    




export type TRoute$manageWallets$refund = {
    query: {},
    params: {
		id: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		transaction: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		sessionId?: string;
		reference: string;
		foreignRefType?: string;
		foreignRef?: string;
		fromName: string;
		from: ObjectId;
		sender: ObjectId;
		toName: string;
		to: ObjectId;
		receiver: ObjectId;
		type: string;
		purpose?: string;
		description?: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status?: "completed";
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
		attachments?: Array<{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
}>;
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

    




export type TRoute$manageWallets$charge = {
    query: {},
    params: {
		type?: string;
		currency?: string;
},
    body: {
		payer: string;
		amount: number;
		description?: string;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
},
    return: {
		status: boolean;
		data: {
		transaction: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		sessionId?: string;
		reference: string;
		foreignRefType?: string;
		foreignRef?: string;
		fromName: string;
		from: ObjectId;
		sender: ObjectId;
		toName: string;
		to: ObjectId;
		receiver: ObjectId;
		type: string;
		purpose?: string;
		description?: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status?: "completed";
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
		attachments?: Array<{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
}>;
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

    




export type TRoute$manageWallets$transactions = {
    query: {
		sent?: boolean;
		received?: boolean;
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
		accountId: string;
		type?: string;
		currency?: string;
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
		sessionId?: string;
		reference: string;
		foreignRefType?: string;
		foreignRef?: string;
		fromName: string;
		from: ObjectId;
		sender: ObjectId;
		toName: string;
		to: ObjectId;
		receiver: ObjectId;
		type: string;
		purpose?: string;
		description?: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status?: "completed";
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
		attachments?: Array<{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
}>;
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


export interface IController$manageWallets {


    balanceList<
        Method extends "post",
        QueryShape extends TRoute$manageWallets$balanceList["query"],
        ParamsShape extends TRoute$manageWallets$balanceList["params"],
        BodyShape extends TRoute$manageWallets$balanceList["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageWallets$balanceList["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    getAll(): TRequestExecutors<TRoute$manageWallets$getAll["return"]>;
    getAll<
        Method extends "get",
        QueryShape extends TRoute$manageWallets$getAll["query"],
        ParamsShape extends TRoute$manageWallets$getAll["params"],
        BodyShape extends TRoute$manageWallets$getAll["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageWallets$getAll["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    refund<
        Method extends "delete",
        QueryShape extends TRoute$manageWallets$refund["query"],
        ParamsShape extends TRoute$manageWallets$refund["params"],
        BodyShape extends TRoute$manageWallets$refund["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageWallets$refund["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    charge<
        Method extends "post",
        QueryShape extends TRoute$manageWallets$charge["query"],
        ParamsShape extends TRoute$manageWallets$charge["params"],
        BodyShape extends TRoute$manageWallets$charge["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageWallets$charge["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    transactions(): TRequestExecutors<TRoute$manageWallets$transactions["return"]>;
    transactions<
        Method extends "get",
        QueryShape extends TRoute$manageWallets$transactions["query"],
        ParamsShape extends TRoute$manageWallets$transactions["params"],
        BodyShape extends TRoute$manageWallets$transactions["body"],
        ReturnShape extends TResponseShape<any> = TRoute$manageWallets$transactions["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const manageWalletsModule = (sdk: any) => {
    const methods = {

    

        balanceList(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("manageWallets", "balanceList");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/manage/wallets/balance/list/:accountId"
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


    

        getAll(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("manageWallets", "getAll");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/manage/wallets/all/:id?"
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


    

        refund(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("manageWallets", "refund");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/manage/wallets/refund/:id"
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


    

        charge(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("manageWallets", "charge");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/manage/wallets/charge/:type?/:currency?"
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


    

        transactions(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("manageWallets", "transactions");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/manage/wallets/transactions/:accountId/:type?/:currency?"
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


    } as IController$manageWallets;


    


    (methods.balanceList as any).__permission = "manageWallets.balanceList";


    


    (methods.getAll as any).__permission = "manageWallets.getAll";


    


    (methods.refund as any).__permission = "manageWallets.refund";


    


    (methods.charge as any).__permission = "manageWallets.charge";


    


    (methods.transactions as any).__permission = "manageWallets.transactions";



    return methods;
};