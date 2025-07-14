/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
import { AxiosInstance, AxiosResponse } from "axios";
import type { TSDKOptions, TCacheKey, TCacheOptions } from "./types";
import { oauthEntry } from "./extensions/oauth/src/entry";
export declare class EpicSDK {
    protected static _cachingAborts: Map<string, AbortController>;
    static _apiVersion: string;
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;
    static init(options?: TSDKOptions): void;
    static isPermitted: (scope: string, permission?: string) => boolean;
    static checkPermission(scope: string, permission?: string): void;
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
    }) => T | Promise<T>, options?: Omit<TCacheOptions<T>, "cacheKey">): {
        get: () => Promise<T>;
        del: () => Promise<boolean>;
        invalidate: () => Promise<T>;
    };
    static resolveAxiosResponse<T>(executor: () => Promise<AxiosResponse<T>>, options?: TCacheOptions<T>): {
        readonly raw: Promise<AxiosResponse<T, any>>;
        readonly res: Promise<T>;
        readonly data: Promise<unknown>;
    };
    static api: import("./modules/api").IController$api;
    static users: import("./modules/users").IController$users;
    static oauth: import("./modules/oauth").IController$oauth;
    static oauthApps: import("./modules/oauthApps").IController$oauthApps;
    static admin: import("./modules/admin").IController$admin;
    static adminPlugins: import("./modules/adminPlugins").IController$adminPlugins;
    static usersIdentification: import("./modules/usersIdentification").IController$usersIdentification;
    static uploads: import("./modules/uploads").IController$uploads;
    static wallet: import("./modules/wallet").IController$wallet;
    static accounts: import("./modules/accounts").IController$accounts;
    static accountInvites: import("./modules/accountInvites").IController$accountInvites;
    static collaborators: import("./modules/collaborators").IController$collaborators;
    static oauthPolicies: import("./modules/oauthPolicies").IController$oauthPolicies;
    static batcher: import("./modules/batcher").IController$batcher;
    static envs: import("./modules/envs").IController$envs;
    static requestLogs: import("./modules/requestLogs").IController$requestLogs;
    static oauthPasskey: import("./modules/oauthPasskey").IController$oauthPasskey;
    static manageWallets: import("./modules/manageWallets").IController$manageWallets;
    static oauthSecrets: import("./modules/oauthSecrets").IController$oauthSecrets;
    static manageUsers: import("./modules/manageUsers").IController$manageUsers;
    static requestLogIgnores: import("./modules/requestLogIgnores").IController$requestLogIgnores;
    static oauth2FA: import("./modules/oauth2FA").IController$oauth2FA;
    static extensions: {
        oauth: typeof oauthEntry;
    };
}
