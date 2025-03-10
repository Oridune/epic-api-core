"use strict";
/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpicSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const api_1 = require("./modules/api");
const users_1 = require("./modules/users");
const oauth_1 = require("./modules/oauth");
const oauthApps_1 = require("./modules/oauthApps");
const admin_1 = require("./modules/admin");
const adminPlugins_1 = require("./modules/adminPlugins");
const usersIdentification_1 = require("./modules/usersIdentification");
const uploads_1 = require("./modules/uploads");
const wallet_1 = require("./modules/wallet");
const accounts_1 = require("./modules/accounts");
const accountInvites_1 = require("./modules/accountInvites");
const collaborators_1 = require("./modules/collaborators");
const oauthPolicies_1 = require("./modules/oauthPolicies");
const batcher_1 = require("./modules/batcher");
const envs_1 = require("./modules/envs");
const requestLogs_1 = require("./modules/requestLogs");
const oauthPasskey_1 = require("./modules/oauthPasskey");
const manageWallets_1 = require("./modules/manageWallets");
const oauthSecrets_1 = require("./modules/oauthSecrets");
const manageUsers_1 = require("./modules/manageUsers");
const entry_1 = require("./extensions/oauth/src/entry");
class EpicSDK {
    static _apiVersion = "latest";
    static _options;
    static _axios;
    static init(options) {
        this._options = options;
        this._axios = axios_1.default.create(options);
    }
    static isPermitted = (scope, permission) => {
        return true;
    };
    static checkPermission(scope, permission) {
        if (!this.isPermitted(scope, permission))
            throw new Error(`You are not authorized to perform this action! Missing permission '${scope}.${permission}'!`);
    }
    static resolveAxiosResponse(executor) {
        const verifyData = (res) => {
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
                return new Promise((resolve, reject) => executors.raw
                    .then((res) => {
                    try {
                        resolve(verifyData(res));
                    }
                    catch (err) {
                        reject(err);
                    }
                })
                    .catch((err) => reject(err)));
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
    static api = (0, api_1.apiModule)(this);
    static users = (0, users_1.usersModule)(this);
    static oauth = (0, oauth_1.oauthModule)(this);
    static oauthApps = (0, oauthApps_1.oauthAppsModule)(this);
    static admin = (0, admin_1.adminModule)(this);
    static adminPlugins = (0, adminPlugins_1.adminPluginsModule)(this);
    static usersIdentification = (0, usersIdentification_1.usersIdentificationModule)(this);
    static uploads = (0, uploads_1.uploadsModule)(this);
    static wallet = (0, wallet_1.walletModule)(this);
    static accounts = (0, accounts_1.accountsModule)(this);
    static accountInvites = (0, accountInvites_1.accountInvitesModule)(this);
    static collaborators = (0, collaborators_1.collaboratorsModule)(this);
    static oauthPolicies = (0, oauthPolicies_1.oauthPoliciesModule)(this);
    static batcher = (0, batcher_1.batcherModule)(this);
    static envs = (0, envs_1.envsModule)(this);
    static requestLogs = (0, requestLogs_1.requestLogsModule)(this);
    static oauthPasskey = (0, oauthPasskey_1.oauthPasskeyModule)(this);
    static manageWallets = (0, manageWallets_1.manageWalletsModule)(this);
    static oauthSecrets = (0, oauthSecrets_1.oauthSecretsModule)(this);
    static manageUsers = (0, manageUsers_1.manageUsersModule)(this);
    static extensions = {
        oauth: entry_1.oauthEntry,
    };
}
exports.EpicSDK = EpicSDK;
