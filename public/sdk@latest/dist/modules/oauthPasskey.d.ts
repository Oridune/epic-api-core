import type { TRequestOptions, TRequestExecutors } from "../types";
export interface IController$oauthPasskey {
    challengeLogin(): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }>;
    challengeLogin<Method extends "get", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    challengeRegister(): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }>;
    challengeRegister<Method extends "get", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    login<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
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
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    register<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        credentials: {
            id: string;
            rawId: string;
            response: any;
            authenticatorAttachment: string;
            clientExtensionResults: any;
            type: string;
        };
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
}
export declare const oauthPasskeyModule: (sdk: any) => IController$oauthPasskey;
