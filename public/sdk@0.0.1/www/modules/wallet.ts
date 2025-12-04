import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.ts";


    




export type TRoute$wallet$balanceList = {
    query: {},
    params: {},
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

    




export type TRoute$wallet$metadata = {
    query: {},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		defaultType: string;
		availableTypes: Array<string>;
		defaultCurrency: string;
		availableCurrencies: Array<string>;
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

    




export type TRoute$wallet$transfer = {
    query: {},
    params: {},
    body: {
		method?: "email" | "phone" | "in-app";
		token: string;
		code: number;
		tags?: Array<string>;
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

    




export type TRoute$wallet$attach = {
    query: {
		name?: string;
		alt?: string;
		contentType: "image/png" | "image/jpg" | "image/jpeg" | "image/webp" | "application/pdf" | "application/vnd.ms-excel" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		contentLength: number;
} & { [K: string]: any }
,
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		method: string;
		url?: string;
		getUrl: string;
		expiresInSeconds: number;
		token: string;
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




export type TRoute$wallet$attachDELETE = {
    query: {},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$wallet$attachPUT = {
    query: {},
    params: {},
    body: {
		token: string;
},
    return: { status: boolean; data: undefined },
};

    




export type TRoute$wallet$signTransfer = {
    query: {
		method?: "email" | "phone" | "in-app";
		receiver: string;
		amount: number;
		description?: string;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
},
    params: {
		type?: string;
		currency?: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		sender: {
		accountId: string;
		userId: string;
		fname: string;
		mname: string;
		lname: string;
		avatar: string;
};
		receiver: {
		accountId: string;
		accountName: string;
		accountLogo: {
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		userId: string;
		fname: string;
		mname: string;
		lname: string;
		avatar: string;
};
		transactionDetails: {
		type: string;
		currency: string;
		amount: number;
		fee: number;
		description: string;
		metadata: {
} & { [K: string]: string | number | boolean }
;
};
		challenge: {
		token: string;
		otp?: number;
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

    




export type TRoute$wallet$balance = {
    query: {},
    params: {
		type?: string;
		currency?: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		lastBalance?: number;
		lastTxnReference?: string;
		negativeAt?: Date | null;
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

    




export type TRoute$wallet$transactions = {
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
		type?: string;
		currency?: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		totalCount?: number;
		results: Array<{
		from: {
		_id?: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		name?: string;
};
		to: {
		_id?: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		name?: string;
};
		sender: {
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
		receiver: {
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
		sessionId?: string;
		reference: string;
		foreignRefType?: string;
		foreignRef?: string;
		fromName: string;
		toName: string;
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


export interface IController$wallet {


    balanceList<
        Method extends "post",
        QueryShape extends TRoute$wallet$balanceList["query"],
        ParamsShape extends TRoute$wallet$balanceList["params"],
        BodyShape extends TRoute$wallet$balanceList["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$balanceList["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    metadata(): TRequestExecutors<TRoute$wallet$metadata["return"]>;
    metadata<
        Method extends "get",
        QueryShape extends TRoute$wallet$metadata["query"],
        ParamsShape extends TRoute$wallet$metadata["params"],
        BodyShape extends TRoute$wallet$metadata["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$metadata["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    transfer<
        Method extends "post",
        QueryShape extends TRoute$wallet$transfer["query"],
        ParamsShape extends TRoute$wallet$transfer["params"],
        BodyShape extends TRoute$wallet$transfer["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$transfer["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    attach(): TRequestExecutors<TRoute$wallet$attach["return"]>;
    attach<
        Method extends "get",
        QueryShape extends TRoute$wallet$attach["query"],
        ParamsShape extends TRoute$wallet$attach["params"],
        BodyShape extends TRoute$wallet$attach["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$attach["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    attachDELETE<
        Method extends "delete",
        QueryShape extends TRoute$wallet$attachDELETE["query"],
        ParamsShape extends TRoute$wallet$attachDELETE["params"],
        BodyShape extends TRoute$wallet$attachDELETE["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$attachDELETE["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    attachPUT<
        Method extends "put",
        QueryShape extends TRoute$wallet$attachPUT["query"],
        ParamsShape extends TRoute$wallet$attachPUT["params"],
        BodyShape extends TRoute$wallet$attachPUT["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$attachPUT["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    signTransfer(): TRequestExecutors<TRoute$wallet$signTransfer["return"]>;
    signTransfer<
        Method extends "get",
        QueryShape extends TRoute$wallet$signTransfer["query"],
        ParamsShape extends TRoute$wallet$signTransfer["params"],
        BodyShape extends TRoute$wallet$signTransfer["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$signTransfer["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    balance(): TRequestExecutors<TRoute$wallet$balance["return"]>;
    balance<
        Method extends "get",
        QueryShape extends TRoute$wallet$balance["query"],
        ParamsShape extends TRoute$wallet$balance["params"],
        BodyShape extends TRoute$wallet$balance["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$balance["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;


    transactions(): TRequestExecutors<TRoute$wallet$transactions["return"]>;
    transactions<
        Method extends "get",
        QueryShape extends TRoute$wallet$transactions["query"],
        ParamsShape extends TRoute$wallet$transactions["params"],
        BodyShape extends TRoute$wallet$transactions["body"],
        ReturnShape extends TResponseShape<any> = TRoute$wallet$transactions["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const walletModule = (sdk: any) => {
    const methods = {

    

        balanceList(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "balanceList");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/balance/list"
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


    

        metadata(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "metadata");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/metadata"
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


    

        transfer(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "transfer");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transfer"
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


    

        attach(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "attach");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transactions/attach/:id/sign"
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
        attachDELETE(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "attachDELETE");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transactions/attach/:id"
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
        attachPUT(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "attachPUT");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transactions/attach/:id"
                ).replace(/:\w+\?\/?/g, "");

                const res = await sdk._axios.request({
                    method: data?.method ?? "put" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });

                return res;
            }, data);
        },


    

        signTransfer(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "signTransfer");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transfer/sign/:type?/:currency?"
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


    

        balance(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "balance");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/balance/:type?/:currency?"
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


    

        transactions(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("wallet", "transactions");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""),
                    "/api/wallet/transactions/:type?/:currency?"
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


    } as IController$wallet;


    


    (methods.balanceList as any).__permission = "wallet.balanceList";


    


    (methods.metadata as any).__permission = "wallet.metadata";


    


    (methods.transfer as any).__permission = "wallet.transfer";


    


    (methods.attach as any).__permission = "wallet.attach";

    (methods.attachDELETE as any).__permission = "wallet.attachDELETE";

    (methods.attachPUT as any).__permission = "wallet.attachPUT";


    


    (methods.signTransfer as any).__permission = "wallet.signTransfer";


    


    (methods.balance as any).__permission = "wallet.balance";


    


    (methods.transactions as any).__permission = "wallet.transactions";



    return methods;
};