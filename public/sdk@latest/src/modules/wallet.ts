import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$wallet {
    
                
            balanceList<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		types?: Array<string>;
		currencies?: Array<string>;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		digest: string;
		lastBalance?: number;
		lastTxnReference?: string;
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
}
    , BodyShape>;
        
                
            metadata(): TRequestExecutors<
        {
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
		metrics: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}
    >;
        metadata<
        Method extends "get",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
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
		metrics: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}
    , BodyShape>;
        
                
            transfer<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		method: string;
		token: string;
		code: number;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
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
}
    , BodyShape>;
        
                
            signTransfer(): TRequestExecutors<
        {
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
		metadata?: {
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
		metrics: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}
    >;
        signTransfer<
        Method extends "get",
        QueryShape extends {
		method: string;
		receiver: string;
		amount: number;
		description?: string;
		metadata?: /*(optional)*/{
} & { [K: string]: number | boolean | string }
;
},
        ParamsShape extends {
		type?: string;
		currency?: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
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
		metadata?: {
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
		metrics: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}
    , BodyShape>;
        
                
            balance(): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		digest: string;
		lastBalance?: number;
		lastTxnReference?: string;
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
}
    >;
        balance<
        Method extends "get",
        QueryShape extends {},
        ParamsShape extends {
		type?: string;
		currency?: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account: ObjectId;
		type: string;
		currency: string;
		balance: number;
		digest: string;
		lastBalance?: number;
		lastTxnReference?: string;
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
}
    , BodyShape>;
        
                
            transactions(): TRequestExecutors<
        {
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
}
    >;
        transactions<
        Method extends "get",
        QueryShape extends {
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
        ParamsShape extends {
		type?: string;
		currency?: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
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
}
    , BodyShape>;
        }

export const walletModule = (sdk: any): IController$wallet => ({
    
    balanceList(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "balanceList");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/wallet/balance/list/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    metadata(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "metadata");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/metadata/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    transfer(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "transfer");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/wallet/transfer/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    signTransfer(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "signTransfer");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/transfer/sign/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    balance(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "balance");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/balance/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    transactions(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("wallet", "transactions");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/transactions/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});