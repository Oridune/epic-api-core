import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$oauthSecrets {
    
                
            createFor<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		userId: string;
		name: string;
		scopes: /*(optional)*/{
} & { [K: string]: Array<string> }
 | Array<string>;
		ttl?: number;
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
        
                
            create<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		name: string;
		scopes: /*(optional)*/{
} & { [K: string]: Array<string> }
 | Array<string>;
		ttl?: number;
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
        
                
            delete<
        Method extends "delete",
        QueryShape extends {},
        ParamsShape extends {
		id: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            get(): TRequestExecutors<
        {
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
		scopes?: {
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
        get<
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
		id?: string;
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
		expiresAt?: Date;
		createdBy: ObjectId;
		oauthApp: ObjectId;
		name: string;
		scopes?: {
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

export const oauthSecretsModule = (sdk: any): IController$oauthSecrets => ({
    
    createFor(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthSecrets", "createFor");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/behalf/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthSecrets", "create");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthSecrets", "delete");

            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/secrets/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthSecrets", "get");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/secrets/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});