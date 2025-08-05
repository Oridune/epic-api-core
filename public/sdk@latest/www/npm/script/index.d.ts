/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
import { type AxiosInstance, type AxiosResponse } from "axios";
import type { TSDKOptions, TCacheKey, TCacheOptions } from "./types.js";
import { oauthEntry } from "./extensions/oauth/entry.js";
export declare class EpicSDK {
    protected static _cachingAborts: Map<string, AbortController>;
    static _apiVersion: string;
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;
    static _useCachingMethods: Map<string, unknown>;
    static init(options?: TSDKOptions): void;
    static isPermitted: (scope: string | (Function & {
        __permission?: string;
    }), permission?: string) => boolean;
    static checkPermission(scope: string | Function & {
        __permission?: string;
    }, permission?: string): void;
    static resolveCacheKey(keys: TCacheKey, namespace?: string): string;
    static setCache(keys: TCacheKey, value: any): Promise<boolean>;
    static getCache<T>(keys: TCacheKey): Promise<{
        value: T;
        timestamp: number;
    } | null>;
    static delCache(keys: TCacheKey): Promise<boolean>;
    static useCache<T>(callback: () => T | Promise<T>, options?: TCacheOptions<T>): Promise<T>;
    static useCaching<T>(cacheKey: TCacheKey, callback: (opts: {
        signal: AbortSignal;
    }) => T | Promise<T>, options?: Omit<TCacheOptions<T>, "cacheKey">, freshMethods?: boolean): {
        get: () => Promise<T>;
        del: () => Promise<boolean>;
        invalidate: () => Promise<T>;
        onInvalidate: (callback: (data: T) => void) => void;
        offInvalidate: (callback: (data: T) => void) => void;
    };
    static resolveAxiosResponse<T>(executor: () => Promise<AxiosResponse<T>>, options?: TCacheOptions<T>): {
        readonly raw: Promise<AxiosResponse<T, any>>;
        readonly res: Promise<T>;
        readonly data: Promise<unknown>;
    };
    static api: import("./modules/api.js").IController$api;
    static users: import("./modules/users.js").IController$users;
    static oauth: import("./modules/oauth.js").IController$oauth;
    static oauthApps: import("./modules/oauthApps.js").IController$oauthApps;
    static admin: import("./modules/admin.js").IController$admin;
    static adminPlugins: import("./modules/adminPlugins.js").IController$adminPlugins;
    static usersIdentification: import("./modules/usersIdentification.js").IController$usersIdentification;
    static uploads: import("./modules/uploads.js").IController$uploads;
    static wallet: import("./modules/wallet.js").IController$wallet;
    static accounts: import("./modules/accounts.js").IController$accounts;
    static accountInvites: import("./modules/accountInvites.js").IController$accountInvites;
    static collaborators: import("./modules/collaborators.js").IController$collaborators;
    static oauthPolicies: import("./modules/oauthPolicies.js").IController$oauthPolicies;
    static batcher: import("./modules/batcher.js").IController$batcher;
    static envs: import("./modules/envs.js").IController$envs;
    static requestLogs: import("./modules/requestLogs.js").IController$requestLogs;
    static oauthPasskey: import("./modules/oauthPasskey.js").IController$oauthPasskey;
    static manageWallets: import("./modules/manageWallets.js").IController$manageWallets;
    static oauthSecrets: import("./modules/oauthSecrets.js").IController$oauthSecrets;
    static manageUsers: import("./modules/manageUsers.js").IController$manageUsers;
    static requestLogIgnores: import("./modules/requestLogIgnores.js").IController$requestLogIgnores;
    static oauth2FA: import("./modules/oauth2FA.js").IController$oauth2FA;
    static extensions: {
        oauth: typeof oauthEntry;
    };
}
//# sourceMappingURL=index.d.ts.map