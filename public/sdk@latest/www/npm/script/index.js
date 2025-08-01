"use strict";
/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpicSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const api_js_1 = require("./modules/api.js");
const users_js_1 = require("./modules/users.js");
const oauth_js_1 = require("./modules/oauth.js");
const oauthApps_js_1 = require("./modules/oauthApps.js");
const admin_js_1 = require("./modules/admin.js");
const adminPlugins_js_1 = require("./modules/adminPlugins.js");
const usersIdentification_js_1 = require("./modules/usersIdentification.js");
const uploads_js_1 = require("./modules/uploads.js");
const wallet_js_1 = require("./modules/wallet.js");
const accounts_js_1 = require("./modules/accounts.js");
const accountInvites_js_1 = require("./modules/accountInvites.js");
const collaborators_js_1 = require("./modules/collaborators.js");
const oauthPolicies_js_1 = require("./modules/oauthPolicies.js");
const batcher_js_1 = require("./modules/batcher.js");
const envs_js_1 = require("./modules/envs.js");
const requestLogs_js_1 = require("./modules/requestLogs.js");
const oauthPasskey_js_1 = require("./modules/oauthPasskey.js");
const manageWallets_js_1 = require("./modules/manageWallets.js");
const oauthSecrets_js_1 = require("./modules/oauthSecrets.js");
const manageUsers_js_1 = require("./modules/manageUsers.js");
const requestLogIgnores_js_1 = require("./modules/requestLogIgnores.js");
const oauth2FA_js_1 = require("./modules/oauth2FA.js");
const entry_js_1 = require("./extensions/oauth/entry.js");
class EpicSDK {
    static init(options) {
        this._options = options;
        this._axios = axios_1.default.create(options?.axiosConfig);
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
exports.EpicSDK = EpicSDK;
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
    value: (0, api_js_1.apiModule)(_a)
});
Object.defineProperty(EpicSDK, "users", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, users_js_1.usersModule)(_a)
});
Object.defineProperty(EpicSDK, "oauth", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauth_js_1.oauthModule)(_a)
});
Object.defineProperty(EpicSDK, "oauthApps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauthApps_js_1.oauthAppsModule)(_a)
});
Object.defineProperty(EpicSDK, "admin", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, admin_js_1.adminModule)(_a)
});
Object.defineProperty(EpicSDK, "adminPlugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, adminPlugins_js_1.adminPluginsModule)(_a)
});
Object.defineProperty(EpicSDK, "usersIdentification", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, usersIdentification_js_1.usersIdentificationModule)(_a)
});
Object.defineProperty(EpicSDK, "uploads", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, uploads_js_1.uploadsModule)(_a)
});
Object.defineProperty(EpicSDK, "wallet", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, wallet_js_1.walletModule)(_a)
});
Object.defineProperty(EpicSDK, "accounts", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, accounts_js_1.accountsModule)(_a)
});
Object.defineProperty(EpicSDK, "accountInvites", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, accountInvites_js_1.accountInvitesModule)(_a)
});
Object.defineProperty(EpicSDK, "collaborators", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, collaborators_js_1.collaboratorsModule)(_a)
});
Object.defineProperty(EpicSDK, "oauthPolicies", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauthPolicies_js_1.oauthPoliciesModule)(_a)
});
Object.defineProperty(EpicSDK, "batcher", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, batcher_js_1.batcherModule)(_a)
});
Object.defineProperty(EpicSDK, "envs", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, envs_js_1.envsModule)(_a)
});
Object.defineProperty(EpicSDK, "requestLogs", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, requestLogs_js_1.requestLogsModule)(_a)
});
Object.defineProperty(EpicSDK, "oauthPasskey", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauthPasskey_js_1.oauthPasskeyModule)(_a)
});
Object.defineProperty(EpicSDK, "manageWallets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, manageWallets_js_1.manageWalletsModule)(_a)
});
Object.defineProperty(EpicSDK, "oauthSecrets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauthSecrets_js_1.oauthSecretsModule)(_a)
});
Object.defineProperty(EpicSDK, "manageUsers", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, manageUsers_js_1.manageUsersModule)(_a)
});
Object.defineProperty(EpicSDK, "requestLogIgnores", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, requestLogIgnores_js_1.requestLogIgnoresModule)(_a)
});
Object.defineProperty(EpicSDK, "oauth2FA", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, oauth2FA_js_1.oauth2FAModule)(_a)
});
Object.defineProperty(EpicSDK, "extensions", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        oauth: entry_js_1.oauthEntry,
    }
});
