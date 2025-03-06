import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";
export interface IController$oauth {
    quickLogin<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        oauthAppId?: string;
        scopes?: /*(optional)*/ {} & {
            [K: string]: Array<string>;
        };
        remember?: boolean;
        asRole?: string;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    exchangeAuthentication<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        authenticationToken: string;
        tokenPayload: any;
        scopes?: {} & {
            [K: string]: Array<string>;
        };
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
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
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    exchangeCode<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        code: string;
        codePayload: any;
        codeVerifier?: string;
        fcmDeviceToken?: string;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            refresh: {
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
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    authenticate<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
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
        data: {
            authenticationToken: {
                issuer: string;
                type: string;
                token: string;
                expiresAtSeconds: number;
            };
            availableScopes: Array<{
                scopes: Array<string>;
                _id?: ObjectId;
                createdAt?: Date;
                updatedAt?: Date;
                createdBy: ObjectId;
                createdFor: ObjectId;
                role?: string;
                isOwned: boolean;
                isPrimary: boolean;
                account: ObjectId;
                isBlocked?: boolean;
            }>;
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    logout<Method extends "delete", QueryShape extends {
        allDevices?: boolean;
        fcmDeviceToken?: string;
    }, ParamsShape extends {}, BodyShape extends {}>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: undefined;
    }, BodyShape>;
    createPermit<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        scopes: Array<string>;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
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
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
    refresh<Method extends "post", QueryShape extends {}, ParamsShape extends {}, BodyShape extends {
        refreshToken: string;
        refreshTokenPayload: any;
    }>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<{
        status: boolean;
        data: {
            refresh: {
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
        } & {
            [K: string]: any;
        }>;
        metrics: /*(optional)*/ {
            handledInMs?: number;
            respondInMs?: number;
        } & {
            [K: string]: any;
        };
        metadata?: /*(optional)*/ {} & {
            [K: string]: any;
        };
    }, BodyShape>;
}
export declare const oauthModule: (sdk: any) => IController$oauth;
