import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";





export type TRoute$oauthApps$getDefault = {
    query: {},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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




export type TRoute$oauthApps$create = {
    query: {},
    params: {},
    body: {
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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




export type TRoute$oauthApps$list = {
    query: {
		limit?: number;
		offset?: number;
},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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




export type TRoute$oauthApps$getDetails = {
    query: {},
    params: {
		appId: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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




export type TRoute$oauthApps$get = {
    query: {},
    params: {
		appId: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
		thirdPartyApp?: /*(optional)*/{
		name?: string;
		description?: string;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		allowedScopes?: Array<{
		label: string;
		description: string;
		scope: string;
}>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		noAuthExpiry?: boolean;
};
		integrations?: Array<{
		id: "re-captcha-v3";
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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




export type TRoute$oauthApps$delete = {
    query: {},
    params: {
		appId: {
};
},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$oauthApps {
    getDefault(): TRequestExecutors<TRoute$oauthApps$getDefault["return"]>;
    getDefault<
        Method extends "get",
        QueryShape extends TRoute$oauthApps$getDefault["query"],
        ParamsShape extends TRoute$oauthApps$getDefault["params"],
        BodyShape extends TRoute$oauthApps$getDefault["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$getDefault["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<
        Method extends "post",
        QueryShape extends TRoute$oauthApps$create["query"],
        ParamsShape extends TRoute$oauthApps$create["params"],
        BodyShape extends TRoute$oauthApps$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$create["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    list(): TRequestExecutors<TRoute$oauthApps$list["return"]>;
    list<
        Method extends "get",
        QueryShape extends TRoute$oauthApps$list["query"],
        ParamsShape extends TRoute$oauthApps$list["params"],
        BodyShape extends TRoute$oauthApps$list["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$list["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    getDetails(): TRequestExecutors<TRoute$oauthApps$getDetails["return"]>;
    getDetails<
        Method extends "get",
        QueryShape extends TRoute$oauthApps$getDetails["query"],
        ParamsShape extends TRoute$oauthApps$getDetails["params"],
        BodyShape extends TRoute$oauthApps$getDetails["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$getDetails["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$oauthApps$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$oauthApps$get["query"],
        ParamsShape extends TRoute$oauthApps$get["params"],
        BodyShape extends TRoute$oauthApps$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$get["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$oauthApps$delete["query"],
        ParamsShape extends TRoute$oauthApps$delete["params"],
        BodyShape extends TRoute$oauthApps$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$oauthApps$delete["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const oauthAppsModule = (sdk: any) => {
    const methods = {

        getDefault(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "getDefault");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps/default"
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

        create(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "create");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps"
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

        list(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "list");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps"
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

        getDetails(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "getDetails");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps/details/:appId"
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

        get(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "get");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps/:appId"
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

        delete(data?: any) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios) throw new Error("Axios not initialized!");

                sdk.checkPermission("oauthApps", "delete");

                const url = Object.entries<string>(data?.params ?? {}).reduce(
                    (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                    "/api/oauth/apps/:appId"
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

    } as IController$oauthApps;


    (methods.getDefault as any).__permission = "oauthApps.getDefault";

    (methods.create as any).__permission = "oauthApps.create";

    (methods.list as any).__permission = "oauthApps.list";

    (methods.getDetails as any).__permission = "oauthApps.getDetails";

    (methods.get as any).__permission = "oauthApps.get";

    (methods.delete as any).__permission = "oauthApps.delete";


    return methods;
};