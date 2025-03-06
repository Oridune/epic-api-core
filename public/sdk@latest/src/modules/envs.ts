import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$envs {
    
                
            create<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		key: string;
		value: string;
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
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		key: string;
		value: string;
		ttl?: number;
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
        
                
            update<
        Method extends "patch",
        QueryShape extends {},
        ParamsShape extends {
		id: string;
},
        BodyShape extends {
		key?: string;
		value?: string;
		ttl?: number;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
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
		key: string;
		value: string;
		ttl?: number;
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
		key: string;
		value: string;
		ttl?: number;
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

export const envsModule = (sdk: any): IController$envs => ({
    
    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "create");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/envs/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    update(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("envs", "update");

            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
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

            sdk.checkPermission("envs", "delete");

            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
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

            sdk.checkPermission("envs", "get");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/envs/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});