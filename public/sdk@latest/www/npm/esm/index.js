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
        return `${namespace}:${(keys instanceof Array ? keys : [keys]).join(":")}`;
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
    static async delCache(keys) {
        if (typeof this._options?.cache?.delete !== "function")
            throw new Error("A cache delete function is not defined!");
        return await this._options.cache.delete(this.resolveCacheKey(keys));
    }
    static async useCache(callback, options) {
        const Cached = options?.cacheKey ? await this.getCache(options.cacheKey) : null;
        returnCache: if (Cached !== null) {
            if (options?.cacheTTL && (Cached.timestamp + (typeof options.cacheTTL === "function"
                ? options.cacheTTL(Cached.value, Cached.timestamp)
                : options.cacheTTL)) < (Date.now() / 1000)) {
                await this.delCache(options.cacheKey);
                break returnCache;
            }
            return Cached.value;
        }
        const Results = await callback();
        // deno-lint-ignore no-explicit-any
        if (options?.cacheKey && ![null, undefined].includes(Results)) {
            await this.setCache(options.cacheKey, Results);
        }
        return Results;
    }
    static useCaching(cacheKey, callback, options, freshMethods = false) {
        const resolvedCacheKey = this.resolveCacheKey(cacheKey);
        const _methods = this._useCachingMethods.get(resolvedCacheKey);
        if (_methods && !freshMethods)
            return _methods;
        const get = () => {
            return this.useCache(() => {
                this._cachingAborts.get(resolvedCacheKey)?.abort();
                const controller = new AbortController();
                this._cachingAborts.set(resolvedCacheKey, controller);
                return callback({ signal: controller.signal });
            }, {
                cacheKey,
                ...options,
            });
        };
        const del = () => this.delCache(cacheKey);
        const invalidateCallbacks = new Set();
        const onInvalidate = (callback) => {
            invalidateCallbacks.add(callback);
        };
        const offInvalidate = (callback) => {
            invalidateCallbacks.delete(callback);
        };
        const invalidate = async () => {
            await del();
            const data = await get();
            for (const callback of invalidateCallbacks) {
                callback(data);
            }
            return data;
        };
        const methods = { get, del, invalidate, onInvalidate, offInvalidate };
        this._useCachingMethods.set(resolvedCacheKey, methods);
        return methods;
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
Object.defineProperty(EpicSDK, "_cachingAborts", {
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
Object.defineProperty(EpicSDK, "extensions", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        oauth: oauthEntry,
    }
});
