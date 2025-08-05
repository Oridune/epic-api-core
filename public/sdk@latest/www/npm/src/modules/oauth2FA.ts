import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";





export type TRoute$oauth2FA$activateTOTP = {
    query: {},
    params: {},
    body: {
		id: ObjectId;
		code: string;
},
    return: {
		status: boolean;
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




export type TRoute$oauth2FA$authorizeTOTP = {
    query: {},
    params: {},
    body: {
		challengeToken: string;
		code: string;
},
    return: {
		status: boolean;
		data: {
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




export type TRoute$oauth2FA$createTOTP = {
    query: {},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		_id: ObjectId;
		uri: string;
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




export type TRoute$oauth2FA$getTOTP = {
    query: {},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		status: "pending" | "active";
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


export interface IController$oauth2FA {
    activateTOTP<
        Method extends "post",
        QueryShape extends TRoute$oauth2FA$activateTOTP["query"],
        ParamsShape extends TRoute$oauth2FA$activateTOTP["params"],
        BodyShape extends TRoute$oauth2FA$activateTOTP["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth2FA$activateTOTP["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    authorizeTOTP<
        Method extends "post",
        QueryShape extends TRoute$oauth2FA$authorizeTOTP["query"],
        ParamsShape extends TRoute$oauth2FA$authorizeTOTP["params"],
        BodyShape extends TRoute$oauth2FA$authorizeTOTP["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth2FA$authorizeTOTP["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    createTOTP<
        Method extends "post",
        QueryShape extends TRoute$oauth2FA$createTOTP["query"],
        ParamsShape extends TRoute$oauth2FA$createTOTP["params"],
        BodyShape extends TRoute$oauth2FA$createTOTP["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth2FA$createTOTP["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    getTOTP(): TRequestExecutors<TRoute$oauth2FA$getTOTP["return"]>;
    getTOTP<
        Method extends "get",
        QueryShape extends TRoute$oauth2FA$getTOTP["query"],
        ParamsShape extends TRoute$oauth2FA$getTOTP["params"],
        BodyShape extends TRoute$oauth2FA$getTOTP["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauth2FA$getTOTP["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const oauth2FAModule = (sdk: any) => {
    const methods = {

        activateTOTP(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauth2FA", "activateTOTP");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/2fa/totp/activate"
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

        authorizeTOTP(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauth2FA", "authorizeTOTP");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/2fa/totp/authorize"
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

        createTOTP(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauth2FA", "createTOTP");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/2fa/totp"
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

        getTOTP(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauth2FA", "getTOTP");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/2fa/totp"
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

    } as IController$oauth2FA;


    (methods.activateTOTP as any).__permission = "oauth2FA.activateTOTP";

    (methods.authorizeTOTP as any).__permission = "oauth2FA.authorizeTOTP";

    (methods.createTOTP as any).__permission = "oauth2FA.createTOTP";

    (methods.getTOTP as any).__permission = "oauth2FA.getTOTP";


    return methods;
};