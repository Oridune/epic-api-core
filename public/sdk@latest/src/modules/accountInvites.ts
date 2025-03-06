import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$accountInvites {
    
                
            create<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		recipient: string;
		role: string;
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
		createdBy: ObjectId;
		recipient: string | string | string;
		role: string;
		account: ObjectId;
		token?: string;
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
		createdBy: ObjectId;
		recipient: string | string | string;
		role: string;
		account: ObjectId;
		token?: string;
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
		createdBy: ObjectId;
		recipient: string | string | string;
		role: string;
		account: ObjectId;
		token?: string;
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

export const accountInvitesModule = (sdk: any): IController$accountInvites => ({
    
    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("accountInvites", "create");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/account/invites/${Object.values(data?.params ?? {}).join("/")}`,
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

            sdk.checkPermission("accountInvites", "delete");

            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/account/invites/:id/${Object.values(data?.params ?? {}).join("/")}`,
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

            sdk.checkPermission("accountInvites", "get");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/account/invites/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});