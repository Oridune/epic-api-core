import type { TRequestOptions, TRequestExecutors, TResponseShape } from "../types";
export type TRoute$oauthPasskey$challengeLogin = {
    query: {};
    params: {};
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauthPasskey$challengeRegister = {
    query: {};
    params: {};
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauthPasskey$login = {
    query: {};
    params: {};
    body: {
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
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauthPasskey$register = {
    query: {};
    params: {};
    body: {
        credentials: {
            id: string;
            rawId: string;
            response: any;
            authenticatorAttachment: string;
            clientExtensionResults: any;
            type: string;
        };
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export interface IController$oauthPasskey {
    challengeLogin(): TRequestExecutors<TRoute$oauthPasskey$challengeLogin["return"]>;
    challengeLogin<Method extends "get", QueryShape extends TRoute$oauthPasskey$challengeLogin["query"], ParamsShape extends TRoute$oauthPasskey$challengeLogin["params"], BodyShape extends TRoute$oauthPasskey$challengeLogin["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPasskey$challengeLogin["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    challengeRegister(): TRequestExecutors<TRoute$oauthPasskey$challengeRegister["return"]>;
    challengeRegister<Method extends "get", QueryShape extends TRoute$oauthPasskey$challengeRegister["query"], ParamsShape extends TRoute$oauthPasskey$challengeRegister["params"], BodyShape extends TRoute$oauthPasskey$challengeRegister["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPasskey$challengeRegister["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    login<Method extends "post", QueryShape extends TRoute$oauthPasskey$login["query"], ParamsShape extends TRoute$oauthPasskey$login["params"], BodyShape extends TRoute$oauthPasskey$login["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPasskey$login["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    register<Method extends "post", QueryShape extends TRoute$oauthPasskey$register["query"], ParamsShape extends TRoute$oauthPasskey$register["params"], BodyShape extends TRoute$oauthPasskey$register["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthPasskey$register["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const oauthPasskeyModule: (sdk: any) => IController$oauthPasskey;
