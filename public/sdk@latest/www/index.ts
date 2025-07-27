/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */

import axios, { AxiosInstance, AxiosResponse } from "npm:axios";

import type { TSDKOptions, TCacheKey, TCacheOptions } from "./types.ts";

import { apiModule } from "./modules/api.ts";
import { usersModule } from "./modules/users.ts";
import { oauthModule } from "./modules/oauth.ts";
import { oauthAppsModule } from "./modules/oauthApps.ts";
import { adminModule } from "./modules/admin.ts";
import { adminPluginsModule } from "./modules/adminPlugins.ts";
import { usersIdentificationModule } from "./modules/usersIdentification.ts";
import { uploadsModule } from "./modules/uploads.ts";
import { walletModule } from "./modules/wallet.ts";
import { accountsModule } from "./modules/accounts.ts";
import { accountInvitesModule } from "./modules/accountInvites.ts";
import { collaboratorsModule } from "./modules/collaborators.ts";
import { oauthPoliciesModule } from "./modules/oauthPolicies.ts";
import { batcherModule } from "./modules/batcher.ts";
import { envsModule } from "./modules/envs.ts";
import { requestLogsModule } from "./modules/requestLogs.ts";
import { oauthPasskeyModule } from "./modules/oauthPasskey.ts";
import { manageWalletsModule } from "./modules/manageWallets.ts";
import { oauthSecretsModule } from "./modules/oauthSecrets.ts";
import { manageUsersModule } from "./modules/manageUsers.ts";
import { requestLogIgnoresModule } from "./modules/requestLogIgnores.ts";
import { oauth2FAModule } from "./modules/oauth2FA.ts";

import { oauthEntry } from "./extensions/oauth/entry.ts";

export class EpicSDK {
    protected static _cachingAborts = new Map<string, AbortController>();

    static _apiVersion = "latest";
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;
    static _useCachingMethods = new Map<string, unknown>();

    static init(options?: TSDKOptions) {
        this._options = options;
        this._axios = axios.create(options?.axiosConfig);
    }

    static isPermitted = (scope: string, permission?: string): boolean => {
        return true;
    }

    static checkPermission(scope: string, permission?: string) {
        if(!this.isPermitted(scope, permission))
            throw new Error(`You are not authorized to perform this action! Missing permission '${scope}.${permission}'!`);
    }

    static resolveCacheKey(keys: TCacheKey, namespace = "__epic-sdk:cache") {
        return `${namespace}:${(keys instanceof Array ? keys : [keys]).join(":")}`;
    }

    static async setCache(keys: TCacheKey, value: any) {
        if(typeof this._options?.cache?.setter !== "function")
            throw new Error("A cache setter is not defined!");

        return await this._options.cache.setter(
            this.resolveCacheKey(keys),
            JSON.stringify({ value, timestamp: Date.now() / 1000 })
        );
    }

    static async getCache<T>(keys: TCacheKey) {
        if(typeof this._options?.cache?.getter !== "function")
            throw new Error("A cache getter is not defined!");

        const value = await this._options.cache.getter(this.resolveCacheKey(keys));

        if(!value) return null;

        return JSON.parse(value) as {
            value: T;
            timestamp: number;
        };
    }

    static async delCache(keys: TCacheKey) {
        if(typeof this._options?.cache?.delete !== "function")
            throw new Error("A cache delete function is not defined!");

        return await this._options.cache.delete(this.resolveCacheKey(keys));
    }

    static async useCache<T>(callback: () => T | Promise<T>, options?: TCacheOptions<T>) {
        const Cached = options?.cacheKey ? await this.getCache<T>(options.cacheKey) : null;

        returnCache: if (Cached !== null) {
            if(
                options?.cacheTTL && (
                    Cached.timestamp + (
                        typeof options.cacheTTL === "function"
                        ? options.cacheTTL(Cached.value, Cached.timestamp)
                        : options.cacheTTL
                    )
                ) < (Date.now() / 1000)
            ) {
                await this.delCache(options.cacheKey!);

                break returnCache;
            }

            return Cached.value;
        }

        const Results = await callback();

        // deno-lint-ignore no-explicit-any
        if (options?.cacheKey && ![null, undefined].includes(Results as any)) {
            await this.setCache(options.cacheKey, Results);
        }

        return Results as T;
    }

    static useCaching<T>(cacheKey: TCacheKey, callback: (opts: { signal: AbortSignal }) => T | Promise<T>, options?: Omit<TCacheOptions<T>, "cacheKey">, freshMethods = false) {
        const resolvedCacheKey = this.resolveCacheKey(cacheKey);

        const _methods = this._useCachingMethods.get(resolvedCacheKey) as typeof methods;

        if(_methods && !freshMethods) return _methods;

        const get = () => {
            return this.useCache<T>(() => {
                this._cachingAborts.get(resolvedCacheKey)?.abort();

                const controller = new AbortController();

                this._cachingAborts.set(resolvedCacheKey, controller);

                return callback({ signal: controller.signal })
            }, {
                cacheKey,
                ...options,
            })
        };

        const del = () => this.delCache(cacheKey);

        const invalidateCallbacks = new Set<(data: T) => void>();

        const onInvalidate = (callback: (data: T) => void) => {
            invalidateCallbacks.add(callback);
        }

        const offInvalidate = (callback: (data: T) => void) => {
            invalidateCallbacks.delete(callback);
        }

        const invalidate = async () => {
            await del();
            
            const data = await get();

            for (const callback of invalidateCallbacks) {
                callback(data);
            }

            return data;
        }

        const methods = { get, del, invalidate, onInvalidate, offInvalidate };

        this._useCachingMethods.set(resolvedCacheKey, methods);

        return methods;
    }

    static resolveAxiosResponse<T>(executor: () => Promise<AxiosResponse<T>>, options?: TCacheOptions<T>) {
        const verifyResponseShape = (res: AxiosResponse) => {
            // Check if the data object exists
            if (!res.data || typeof res.data !== "object") {
                throw new Error("Response data is missing or invalid!");
            } else if (!res.data.status) {
                throw new Error(res.data.messages?.[0]?.message ?? "failure");
            }

            return res.data;
        };

        const executors = {
            get raw() {
                return executor();
            },
            get res() {
                const callback = () => new Promise<T>((resolve, reject) => {
                    executors.raw
                        .then((res) => {
                            try {
                                resolve(verifyResponseShape(res));
                            } catch (err) {
                                reject(err);
                            }
                        })
                        .catch((err) => reject(err))
                });

                if(options?.cacheKey) return EpicSDK.useCache(callback, options);

                return callback();
            },
            get data() {
                return (async () => {
                    const res = await executors.res;

                    if (
                        typeof res === "object" && res !== null && "data" in res
                    ) return res.data;

                    throw new Error(
                        "Unexpected response! Data is not available or valid!",
                    );
                })();
            },
        };

        return executors;
    }

    static api = apiModule(this);
    static users = usersModule(this);
    static oauth = oauthModule(this);
    static oauthApps = oauthAppsModule(this);
    static admin = adminModule(this);
    static adminPlugins = adminPluginsModule(this);
    static usersIdentification = usersIdentificationModule(this);
    static uploads = uploadsModule(this);
    static wallet = walletModule(this);
    static accounts = accountsModule(this);
    static accountInvites = accountInvitesModule(this);
    static collaborators = collaboratorsModule(this);
    static oauthPolicies = oauthPoliciesModule(this);
    static batcher = batcherModule(this);
    static envs = envsModule(this);
    static requestLogs = requestLogsModule(this);
    static oauthPasskey = oauthPasskeyModule(this);
    static manageWallets = manageWalletsModule(this);
    static oauthSecrets = oauthSecretsModule(this);
    static manageUsers = manageUsersModule(this);
    static requestLogIgnores = requestLogIgnoresModule(this);
    static oauth2FA = oauth2FAModule(this);

    static extensions = {
        oauth: oauthEntry,
    }
}
