/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
var _a;
import axios from "axios";
import { apiModule } from "./modules/api.js";
import { usersModule } from "./modules/users.js";
import { oauthModule } from "./modules/oauth.js";
import { oauthAppsModule } from "./modules/oauthApps.js";
import { adminModule } from "./modules/admin.js";
import { adminPluginsModule } from "./modules/adminPlugins.js";
import { usersIdentificationModule } from "./modules/usersIdentification.js";
import { uploadsModule } from "./modules/uploads.js";
import { walletModule } from "./modules/wallet.js";
import { accountsModule } from "./modules/accounts.js";
import { accountInvitesModule } from "./modules/accountInvites.js";
import { collaboratorsModule } from "./modules/collaborators.js";
import { oauthPoliciesModule } from "./modules/oauthPolicies.js";
import { batcherModule } from "./modules/batcher.js";
import { envsModule } from "./modules/envs.js";
import { requestLogsModule } from "./modules/requestLogs.js";
import { oauthPasskeyModule } from "./modules/oauthPasskey.js";
import { manageWalletsModule } from "./modules/manageWallets.js";
import { oauthSecretsModule } from "./modules/oauthSecrets.js";
import { manageUsersModule } from "./modules/manageUsers.js";
import { requestLogIgnoresModule } from "./modules/requestLogIgnores.js";
import { oauth2FAModule } from "./modules/oauth2FA.js";
import { walletAddressesModule } from "./modules/walletAddresses.js";
import { walletMonitoringModule } from "./modules/walletMonitoring.js";
import { oauthEntry } from "./extensions/oauth/entry.js";
export class EpicSDK {
    static init(options) {
        this._options = options;
        this._axios = axios.create(options?.axiosConfig);
    }
    static checkPermission(scope, permission) {
        if (!this.isPermitted(scope, permission))
            throw new Error(`You are not authorized to perform this action! Missing permission '${scope}.${permission}'!`);
    }
    static resolveCacheKey(keys, namespace = "__epic-sdk:cache") {
        return `${namespace}:${(keys instanceof Array ? keys : [keys]).filter(Boolean).join(":")}`;
    }
    static async setCache(keys, value) {
        if (typeof this._options?.cache?.setter !== "function")
            throw new Error("A cache setter is not defined!");
        return await this._options.cache.setter(this.resolveCacheKey(keys), JSON.stringify({ value, timestamp: Date.now() / 1000 }));
    }
    static async getCache(keys) {
        if (typeof this._options?.cache?.getter !== "function")
            throw new Error("A cache getter is not defined!");
        const value = await this._options.cache.getter(this.resolveCacheKey(keys));
        if (!value)
            return null;
        return JSON.parse(value);
    }
    static async expireCache(keys) {
        if (typeof this._options?.cache?.getter !== "function")
            throw new Error("A cache getter is not defined!");
        if (typeof this._options?.cache?.setter !== "function")
            throw new Error("A cache setter is not defined!");
        const value = await this._options.cache.getter(this.resolveCacheKey(keys));
        if (!value)
            return false;
        return await this._options.cache.setter(this.resolveCacheKey(keys), `{"expired": true,` + value.substring(1));
    }
    static async delCache(keys) {
        if (typeof this._options?.cache?.delete !== "function")
            throw new Error("A cache delete function is not defined!");
        return await this._options.cache.delete(this.resolveCacheKey(keys));
    }
    static async cacheKeys(startsWith) {
        if (typeof this._options?.cache?.keys !== "function")
            throw new Error("A cache keys function is not defined!");
        return (await this._options.cache.keys()).filter(key => key.startsWith(startsWith ?? this.resolveCacheKey("")));
    }
    static async useCache(callback, options) {
        const Cached = options?.cacheKey ? await this.getCache(options.cacheKey) : null;
        returnCache: if (Cached !== null) {
            if (Cached.expired)
                break returnCache;
            if (options?.cacheTTL && (Cached.timestamp + (typeof options.cacheTTL === "function"
                ? options.cacheTTL(Cached.value, Cached.timestamp)
                : options.cacheTTL)) < (Date.now() / 1000)) {
                await this.expireCache(options.cacheKey);
                break returnCache;
            }
            return Cached.value;
        }
        try {
            const Results = await callback();
            if (options?.cacheKey && ![null, undefined].includes(Results)) {
                await this.setCache(options.cacheKey, Results);
            }
            return Results;
        }
        catch (error) {
            if (Cached)
                return Cached.value;
            throw error;
        }
    }
    static useCaching(cacheKey, callback, options, freshMethods = false) {
        const resolvedCacheKey = this.resolveCacheKey(cacheKey);
        const _methods = this._useCachingMethods.get(resolvedCacheKey);
        if (_methods && !freshMethods)
            return _methods;
        const get = () => {
            return this.useCache(async () => {
                const activity = this._cachingActivity.get(resolvedCacheKey);
                if (activity) {
                    if (Date.now() - activity.timestamp > 1000) {
                        activity.controller.abort("Repeated request!");
                    }
                    else {
                        return activity.resultPromise;
                    }
                }
                const controller = new AbortController();
                const resultPromise = callback({ signal: controller.signal });
                this._cachingActivity.set(resolvedCacheKey, {
                    controller,
                    resultPromise,
                    timestamp: Date.now(),
                });
                const result = await resultPromise;
                this._cachingActivity.delete(resolvedCacheKey);
                return result;
            }, {
                cacheKey,
                ...options,
            });
        };
        const expire = () => this.expireCache(cacheKey);
        const del = () => this.delCache(cacheKey);
        const invalidateCallbacks = new Set();
        const onInvalidate = (callback) => {
            invalidateCallbacks.add(callback);
        };
        const offInvalidate = (callback) => {
            invalidateCallbacks.delete(callback);
        };
        const invalidate = async (options) => {
            if (!options?.stopPropagation) {
                const baseKey = cacheKey instanceof Array ? cacheKey[0] : cacheKey;
                const cacheKeys = Array.from(this._useCachingMethods.keys());
                await Promise.all(cacheKeys.map(async (key) => {
                    if (resolvedCacheKey !== key && new RegExp(`^${this.resolveCacheKey(baseKey)}($|:.*)`).test(key)) {
                        const cachingMethods = this._useCachingMethods.get(key);
                        await cachingMethods.invalidate({ stopPropagation: true });
                    }
                }));
            }
            await expire();
            const data = await get();
            for (const callback of invalidateCallbacks) {
                callback(data);
            }
            return data;
        };
        const methods = { get, expire, del, invalidate, onInvalidate, offInvalidate };
        this._useCachingMethods.set(resolvedCacheKey, methods);
        return methods;
    }
    static async withCaching(callback, options) {
        for (const [key, methods] of this._useCachingMethods) {
            if (options && options.matcher instanceof RegExp && !options.matcher.test(key))
                continue;
            await callback(methods, key);
        }
    }
    static resolveAxiosResponse(executor, options) {
        const verifyResponseShape = (res) => {
            // Check if the data object exists
            if (!res.data || typeof res.data !== "object") {
                throw new Error("Response data is missing or invalid!");
            }
            else if (!res.data.status) {
                throw new Error(res.data.messages?.[0]?.message ?? "failure");
            }
            return res.data;
        };
        const executors = {
            get raw() {
                return executor();
            },
            get res() {
                const callback = () => new Promise((resolve, reject) => {
                    executors.raw
                        .then((res) => {
                        try {
                            resolve(verifyResponseShape(res));
                        }
                        catch (err) {
                            reject(err);
                        }
                    })
                        .catch((err) => reject(err));
                });
                if (options?.cacheKey)
                    return _a.useCache(callback, options);
                return callback();
            },
            get data() {
                return (async () => {
                    const res = await executors.res;
                    if (typeof res === "object" && res !== null && "data" in res)
                        return res.data;
                    throw new Error("Unexpected response! Data is not available or valid!");
                })();
            },
        };
        return executors;
    }
}
_a = EpicSDK;
Object.defineProperty(EpicSDK, "_cachingActivity", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
Object.defineProperty(EpicSDK, "_apiVersion", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "latest"
});
Object.defineProperty(EpicSDK, "_useCachingMethods", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
Object.defineProperty(EpicSDK, "isPermitted", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (scope, permission) => {
        return true;
    }
});
Object.defineProperty(EpicSDK, "api", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: apiModule(_a)
});
Object.defineProperty(EpicSDK, "users", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: usersModule(_a)
});
Object.defineProperty(EpicSDK, "oauth", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauthModule(_a)
});
Object.defineProperty(EpicSDK, "oauthApps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauthAppsModule(_a)
});
Object.defineProperty(EpicSDK, "admin", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: adminModule(_a)
});
Object.defineProperty(EpicSDK, "adminPlugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: adminPluginsModule(_a)
});
Object.defineProperty(EpicSDK, "usersIdentification", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: usersIdentificationModule(_a)
});
Object.defineProperty(EpicSDK, "uploads", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: uploadsModule(_a)
});
Object.defineProperty(EpicSDK, "wallet", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: walletModule(_a)
});
Object.defineProperty(EpicSDK, "accounts", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: accountsModule(_a)
});
Object.defineProperty(EpicSDK, "accountInvites", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: accountInvitesModule(_a)
});
Object.defineProperty(EpicSDK, "collaborators", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: collaboratorsModule(_a)
});
Object.defineProperty(EpicSDK, "oauthPolicies", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauthPoliciesModule(_a)
});
Object.defineProperty(EpicSDK, "batcher", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: batcherModule(_a)
});
Object.defineProperty(EpicSDK, "envs", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: envsModule(_a)
});
Object.defineProperty(EpicSDK, "requestLogs", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: requestLogsModule(_a)
});
Object.defineProperty(EpicSDK, "oauthPasskey", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauthPasskeyModule(_a)
});
Object.defineProperty(EpicSDK, "manageWallets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: manageWalletsModule(_a)
});
Object.defineProperty(EpicSDK, "oauthSecrets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauthSecretsModule(_a)
});
Object.defineProperty(EpicSDK, "manageUsers", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: manageUsersModule(_a)
});
Object.defineProperty(EpicSDK, "requestLogIgnores", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: requestLogIgnoresModule(_a)
});
Object.defineProperty(EpicSDK, "oauth2FA", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: oauth2FAModule(_a)
});
Object.defineProperty(EpicSDK, "walletAddresses", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: walletAddressesModule(_a)
});
Object.defineProperty(EpicSDK, "walletMonitoring", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: walletMonitoringModule(_a)
});
Object.defineProperty(EpicSDK, "extensions", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        oauth: oauthEntry,
    }
});
