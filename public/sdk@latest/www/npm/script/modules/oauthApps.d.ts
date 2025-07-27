import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$oauthApps$getDefault = {
    query: {};
    params: {};
    body: {};
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
                logo?: {
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
                styling?: {
                    roundness?: number;
                };
                passwordPolicy?: {
                    strength?: number;
                    minLength?: number;
                    maxLength?: number;
                };
                allowedCallbackURLs: Array<string>;
                homepageURL: string;
                privacyPolicyURL?: string;
                termsAndConditionsURL?: string;
                supportURL?: string;
                thirdPartyApp?: {
                    name?: string;
                    description?: string;
                    logo?: {
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
                props?: /*(optional)*/ {} & {
                    [K: string]: string;
                };
            }>;
            metadata?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
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
export type TRoute$oauthApps$create = {
    query: {};
    params: {};
    body: {
        name: string;
        description?: string;
        enabled?: boolean;
        consent: {
            availableSignups?: number;
            passkeyEnabled?: boolean;
            availableCountryCodes?: Array<string>;
            requiredIdentificationMethods?: Array<"email" | "phone" | "in-app">;
            logo?: {
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
            styling?: {
                roundness?: number;
            };
            passwordPolicy?: {
                strength?: number;
                minLength?: number;
                maxLength?: number;
            };
            allowedCallbackURLs: Array<string>;
            homepageURL: string;
            privacyPolicyURL?: string;
            termsAndConditionsURL?: string;
            supportURL?: string;
            thirdPartyApp?: {
                name?: string;
                description?: string;
                logo?: {
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
            props?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        }>;
        metadata?: /*(optional)*/ {} & {
            [K: string]: string;
        };
    };
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
                logo?: {
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
                styling?: {
                    roundness?: number;
                };
                passwordPolicy?: {
                    strength?: number;
                    minLength?: number;
                    maxLength?: number;
                };
                allowedCallbackURLs: Array<string>;
                homepageURL: string;
                privacyPolicyURL?: string;
                termsAndConditionsURL?: string;
                supportURL?: string;
                thirdPartyApp?: {
                    name?: string;
                    description?: string;
                    logo?: {
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
                props?: /*(optional)*/ {} & {
                    [K: string]: string;
                };
            }>;
            metadata?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
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
export type TRoute$oauthApps$list = {
    query: {
        limit?: number;
        offset?: number;
    };
    params: {};
    body: {};
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
                logo?: {
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
                styling?: {
                    roundness?: number;
                };
                passwordPolicy?: {
                    strength?: number;
                    minLength?: number;
                    maxLength?: number;
                };
                allowedCallbackURLs: Array<string>;
                homepageURL: string;
                privacyPolicyURL?: string;
                termsAndConditionsURL?: string;
                supportURL?: string;
                thirdPartyApp?: {
                    name?: string;
                    description?: string;
                    logo?: {
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
                props?: /*(optional)*/ {} & {
                    [K: string]: string;
                };
            }>;
            metadata?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        }>;
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
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
export type TRoute$oauthApps$getDetails = {
    query: {};
    params: {
        appId: string;
    };
    body: {};
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
                logo?: {
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
                styling?: {
                    roundness?: number;
                };
                passwordPolicy?: {
                    strength?: number;
                    minLength?: number;
                    maxLength?: number;
                };
                allowedCallbackURLs: Array<string>;
                homepageURL: string;
                privacyPolicyURL?: string;
                termsAndConditionsURL?: string;
                supportURL?: string;
                thirdPartyApp?: {
                    name?: string;
                    description?: string;
                    logo?: {
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
                props?: /*(optional)*/ {} & {
                    [K: string]: string;
                };
            }>;
            metadata?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
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
export type TRoute$oauthApps$get = {
    query: {};
    params: {
        appId: string;
    };
    body: {};
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
                logo?: {
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
                styling?: {
                    roundness?: number;
                };
                passwordPolicy?: {
                    strength?: number;
                    minLength?: number;
                    maxLength?: number;
                };
                allowedCallbackURLs: Array<string>;
                homepageURL: string;
                privacyPolicyURL?: string;
                termsAndConditionsURL?: string;
                supportURL?: string;
                thirdPartyApp?: {
                    name?: string;
                    description?: string;
                    logo?: {
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
                props?: /*(optional)*/ {} & {
                    [K: string]: string;
                };
            }>;
            metadata?: /*(optional)*/ {} & {
                [K: string]: string;
            };
        };
        messages?: Array<{
            message?: string;
            location?: string;
            name?: string;
        } & {
            [K: string]: any;
        }>;
        metrics?: /*(optional)*/ {
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
export type TRoute$oauthApps$delete = {
    query: {};
    params: {
        appId: {};
    };
    body: {};
    return: {
        status: boolean;
        data: undefined;
    };
};
export interface IController$oauthApps {
    getDefault(): TRequestExecutors<TRoute$oauthApps$getDefault["return"]>;
    getDefault<Method extends "get", QueryShape extends TRoute$oauthApps$getDefault["query"], ParamsShape extends TRoute$oauthApps$getDefault["params"], BodyShape extends TRoute$oauthApps$getDefault["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$getDefault["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<Method extends "post", QueryShape extends TRoute$oauthApps$create["query"], ParamsShape extends TRoute$oauthApps$create["params"], BodyShape extends TRoute$oauthApps$create["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$create["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    list(): TRequestExecutors<TRoute$oauthApps$list["return"]>;
    list<Method extends "get", QueryShape extends TRoute$oauthApps$list["query"], ParamsShape extends TRoute$oauthApps$list["params"], BodyShape extends TRoute$oauthApps$list["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$list["return"]>(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    getDetails(): TRequestExecutors<TRoute$oauthApps$getDetails["return"]>;
    getDetails<Method extends "get", QueryShape extends TRoute$oauthApps$getDetails["query"], ParamsShape extends TRoute$oauthApps$getDetails["params"], BodyShape extends TRoute$oauthApps$getDetails["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$getDetails["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$oauthApps$get["return"]>;
    get<Method extends "get", QueryShape extends TRoute$oauthApps$get["query"], ParamsShape extends TRoute$oauthApps$get["params"], BodyShape extends TRoute$oauthApps$get["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$get["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<Method extends "delete", QueryShape extends TRoute$oauthApps$delete["query"], ParamsShape extends TRoute$oauthApps$delete["params"], BodyShape extends TRoute$oauthApps$delete["body"], ReturnShape extends TResponseShape<any> = TRoute$oauthApps$delete["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const oauthAppsModule: (sdk: any) => IController$oauthApps;
//# sourceMappingURL=oauthApps.d.ts.map