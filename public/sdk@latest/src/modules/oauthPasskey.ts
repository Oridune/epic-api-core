import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$oauthPasskey {
    
                
            challengeLogin(): TRequestExecutors<
        { status: boolean; data: undefined }
    >;
        challengeLogin<
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
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            challengeRegister(): TRequestExecutors<
        { status: boolean; data: undefined }
    >;
        challengeRegister<
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
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            login<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		username: string;
		credentials: {
		id: string;
		rawId: string;
		response: any;
		authenticatorAttachment: string;
		clientExtensionResults: any;
		type: string;
};
		oauthAppId: string;
		oauthApp: any;
		callbackURL: string;
		codeChallenge?: string;
		codeChallengeMethod: string;
		remember?: boolean;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            register<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		credentials: {
		id: string;
		rawId: string;
		response: any;
		authenticatorAttachment: string;
		clientExtensionResults: any;
		type: string;
};
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        }

export const oauthPasskeyModule = (sdk: any): IController$oauthPasskey => ({
    
    challengeLogin(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthPasskey", "challengeLogin");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/passkey/challenge/login/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    challengeRegister(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthPasskey", "challengeRegister");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/passkey/challenge/register/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    login(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthPasskey", "login");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/passkey/login/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    register(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthPasskey", "register");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/passkey/register/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});