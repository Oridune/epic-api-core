import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";
export type TRoute$oauth$quickLogin = {
    query: {};
    params: {};
    body: {
        oauthAppId?: string;
        scopes?: /*(optional)*/ {} & {
            [K: string]: Array<string>;
        };
        remember?: boolean;
        asRole?: string;
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauth$exchangeAuthentication = {
    query: {};
    params: {};
    body: {
        authenticationToken: string;
        tokenPayload: any;
        scopes?: {} & {
            [K: string]: Array<string>;
        };
    };
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
    };
};
export type TRoute$oauth$exchangeCode = {
    query: {};
    params: {};
    body: {
        code: string;
        codePayload: any;
        codeVerifier?: string;
        fcmDeviceToken?: string;
    };
    return: {
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
    };
};
export type TRoute$oauth$authenticate = {
    query: {};
    params: {};
    body: {
        oauthAppId: string;
        oauthApp: any;
        callbackURL: string;
        codeChallenge?: string;
        codeChallengeMethod: string;
        remember?: boolean;
    };
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
                account?: {
                    _id?: ObjectId;
                    logo: {
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
    };
};
export type TRoute$oauth$logout = {
    query: {
        allDevices?: boolean;
        fcmDeviceToken?: string;
    };
    params: {};
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export type TRoute$oauth$createPermit = {
    query: {};
    params: {};
    body: {
        scopes: Array<string>;
    };
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
    };
};
export type TRoute$oauth$refresh = {
    query: {};
    params: {};
    body: {
        refreshToken: string;
        refreshTokenPayload: any;
    };
    return: {
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
    };
};
export interface IController$oauth {
    quickLogin<Method extends "post", QueryShape extends TRoute$oauth$quickLogin["query"], ParamsShape extends TRoute$oauth$quickLogin["params"], BodyShape extends TRoute$oauth$quickLogin["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$quickLogin["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    exchangeAuthentication<Method extends "post", QueryShape extends TRoute$oauth$exchangeAuthentication["query"], ParamsShape extends TRoute$oauth$exchangeAuthentication["params"], BodyShape extends TRoute$oauth$exchangeAuthentication["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$exchangeAuthentication["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    exchangeCode<Method extends "post", QueryShape extends TRoute$oauth$exchangeCode["query"], ParamsShape extends TRoute$oauth$exchangeCode["params"], BodyShape extends TRoute$oauth$exchangeCode["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$exchangeCode["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    authenticate<Method extends "post", QueryShape extends TRoute$oauth$authenticate["query"], ParamsShape extends TRoute$oauth$authenticate["params"], BodyShape extends TRoute$oauth$authenticate["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$authenticate["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    logout<Method extends "delete", QueryShape extends TRoute$oauth$logout["query"], ParamsShape extends TRoute$oauth$logout["params"], BodyShape extends TRoute$oauth$logout["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$logout["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    createPermit<Method extends "post", QueryShape extends TRoute$oauth$createPermit["query"], ParamsShape extends TRoute$oauth$createPermit["params"], BodyShape extends TRoute$oauth$createPermit["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$createPermit["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    refresh<Method extends "post", QueryShape extends TRoute$oauth$refresh["query"], ParamsShape extends TRoute$oauth$refresh["params"], BodyShape extends TRoute$oauth$refresh["body"], ReturnShape extends TResponseShape<any> = TRoute$oauth$refresh["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const oauthModule: (sdk: any) => IController$oauth;
