/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";

import type { TSDKOptions, TCacheKey, TCacheOptions } from "./types";

import { apiModule } from "./modules/api";
import { usersModule } from "./modules/users";
import { oauthModule } from "./modules/oauth";
import { oauthAppsModule } from "./modules/oauthApps";
import { adminModule } from "./modules/admin";
import { adminPluginsModule } from "./modules/adminPlugins";
import { usersIdentificationModule } from "./modules/usersIdentification";
import { uploadsModule } from "./modules/uploads";
import { walletModule } from "./modules/wallet";
import { accountsModule } from "./modules/accounts";
import { accountInvitesModule } from "./modules/accountInvites";
import { collaboratorsModule } from "./modules/collaborators";
import { oauthPoliciesModule } from "./modules/oauthPolicies";
import { batcherModule } from "./modules/batcher";
import { envsModule } from "./modules/envs";
import { requestLogsModule } from "./modules/requestLogs";
import { oauthPasskeyModule } from "./modules/oauthPasskey";
import { manageWalletsModule } from "./modules/manageWallets";
import { oauthSecretsModule } from "./modules/oauthSecrets";
import { manageUsersModule } from "./modules/manageUsers";
import { requestLogIgnoresModule } from "./modules/requestLogIgnores";
import { oauth2FAModule } from "./modules/oauth2FA";

import { oauthEntry } from "./extensions/oauth/src/entry";

export class EpicSDK {
    protected static _cachingAborts = new Map<string, AbortController>();

    static _apiVersion = "latest";
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;

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
                ) < Date.now()
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

    static useCaching<T>(cacheKey: TCacheKey, callback: (opts: { signal: AbortSignal }) => T | Promise<T>, options?: Omit<TCacheOptions<T>, "cacheKey">) {
        const resolvedCacheKey = this.resolveCacheKey(cacheKey);

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

        const invalidate = async () => {
            await del();
            
            return await get();
        }

        return { get, del, invalidate };
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
                return EpicSDK.useCache(
                    () => new Promise<T>((resolve, reject) => {
                        executors.raw
                            .then((res) => {
                                try {
                                    resolve(verifyResponseShape(res));
                                } catch (err) {
                                    reject(err);
                                }
                            })
                            .catch((err) => reject(err))
                    }),
                    options,
                );
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
