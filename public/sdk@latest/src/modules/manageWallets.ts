import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





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
		negativeAt: Date | null;
}>;
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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
		range?: Array<{} | undefined>;
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
		negativeAt: Date | null;
}>;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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
		description: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status: string;
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
};
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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
		description: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status: string;
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
};
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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
		search?: string;
		sent?: boolean;
		received?: boolean;
		range?: Array<{} | undefined>;
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
		description: /*(optional)*/{
} & { [K: string]: string }
 | string;
		tags?: Array<string>;
		currency: string;
		amount: number;
		senderPreviousBalance?: number;
		receiverPreviousBalance?: number;
		methodOf3DSecurity?: string;
		status: string;
		isRefund?: boolean;
		isRefunded?: boolean;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
}>;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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
        body?: BodyShape;
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
        query?: QueryShape;
        params?: ParamsShape;
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
        params?: ParamsShape;
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
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const manageWalletsModule = (sdk: any): IController$manageWallets => ({

    balanceList(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageWallets", "balanceList");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/manage/wallets/balance/list/:accountId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    getAll(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageWallets", "getAll");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/manage/wallets/all/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    refund(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageWallets", "refund");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/manage/wallets/refund/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    charge(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageWallets", "charge");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/manage/wallets/charge/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    transactions(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("manageWallets", "transactions");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/manage/wallets/transactions/:accountId/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});