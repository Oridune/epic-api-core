import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$oauth$quickLogin = {
    query: {},
    params: {},
    body: {
		oauthAppId?: string;
		scopes?: /*(optional)*/{
} & { [K: string]: Array<string> }
;
		remember?: boolean;
		asRole?: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$oauth$exchangeAuthentication = {
    query: {},
    params: {},
    body: {
		authenticationToken: string;
		tokenPayload?: any;
		scopes: {
} & { [K: string]: Array<string> }
;
},
    return: {
		status: boolean;
		data: {
		oauthCode: {
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




export type TRoute$oauth$exchangeCode = {
    query: {},
    params: {},
    body: {
		code: string;
		codePayload?: any;
		codeVerifier?: string;
		fcmDeviceToken?: string;
		geoPoint?: /*(optional)*/{
		type?: "Point" | (string & {});
		coordinates: [number,number];
};
},
    return: {
		status: boolean;
		data: {
		refresh?: /*(optional)*/{
		issuer: string;
		type: string;
		token: string;
		expiresAtSeconds: number;
};
		access: {
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




export type TRoute$oauth$authenticate = {
    query: {},
    params: {},
    body: {
		oauthAppId: string;
		oauthApp?: any;
		callbackURL: string;
		codeChallenge?: string;
		codeChallengeMethod: string;
		remember?: boolean;
},
    return: {
		status: boolean;
		data: {
		authenticationToken: {
		issuer: string;
		type: string;
		token: string;
		expiresAtSeconds: number;
};
		availableScopes: Array<{
		scopes: Array<string>;
		account: {
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
		description?: string;
};
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		role?: string;
		isOwned: boolean;
		isPrimary: boolean;
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




export type TRoute$oauth$logout = {
    query: {
		allDevices?: boolean;
		fcmDeviceToken?: string;
},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$oauth$createPermit = {
    query: {},
    params: {},
    body: {
		scopes: Array<string>;
},
    return: {
		status: boolean;
		data: {
		permit: {
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




export type TRoute$oauth$refresh = {
    query: {},
    params: {},
    body: {
		refreshToken: string;
		refreshTokenPayload?: any;
},
    return: {
		status: boolean;
		data: {
		refresh?: /*(optional)*/{
		issuer: string;
		type: string;
		token: string;
		expiresAtSeconds: number;
};
		access: {
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


export interface IController$oauth {
    quickLogin<
        Method extends "post",
        QueryShape extends TRoute$oauth$quickLogin["query"],
        ParamsShape extends TRoute$oauth$quickLogin["params"],
        BodyShape extends TRoute$oauth$quickLogin["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$quickLogin["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    exchangeAuthentication<
        Method extends "post",
        QueryShape extends TRoute$oauth$exchangeAuthentication["query"],
        ParamsShape extends TRoute$oauth$exchangeAuthentication["params"],
        BodyShape extends TRoute$oauth$exchangeAuthentication["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$exchangeAuthentication["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    exchangeCode<
        Method extends "post",
        QueryShape extends TRoute$oauth$exchangeCode["query"],
        ParamsShape extends TRoute$oauth$exchangeCode["params"],
        BodyShape extends TRoute$oauth$exchangeCode["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$exchangeCode["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    authenticate<
        Method extends "post",
        QueryShape extends TRoute$oauth$authenticate["query"],
        ParamsShape extends TRoute$oauth$authenticate["params"],
        BodyShape extends TRoute$oauth$authenticate["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$authenticate["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    logout<
        Method extends "delete",
        QueryShape extends TRoute$oauth$logout["query"],
        ParamsShape extends TRoute$oauth$logout["params"],
        BodyShape extends TRoute$oauth$logout["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$logout["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    createPermit<
        Method extends "post",
        QueryShape extends TRoute$oauth$createPermit["query"],
        ParamsShape extends TRoute$oauth$createPermit["params"],
        BodyShape extends TRoute$oauth$createPermit["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$createPermit["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    refresh<
        Method extends "post",
        QueryShape extends TRoute$oauth$refresh["query"],
        ParamsShape extends TRoute$oauth$refresh["params"],
        BodyShape extends TRoute$oauth$refresh["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth$refresh["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const oauthModule = (sdk: any): IController$oauth => ({

    quickLogin(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "quickLogin");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/local/quick/login/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    exchangeAuthentication(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "exchangeAuthentication");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/exchange/authentication/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    exchangeCode(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "exchangeCode");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/exchange/code/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    authenticate(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "authenticate");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/local/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    logout(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "logout");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/logout/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    createPermit(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "createPermit");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/permit/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    refresh(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauth", "refresh");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/refresh/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});