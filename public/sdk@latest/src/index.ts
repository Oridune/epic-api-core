/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";

import type { TSDKOptions } from "./types";

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

import { oauthEntry } from "./extensions/oauth/src/entry";

export class EpicSDK {
    static _apiVersion = "latest";
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;

    static init(options: TSDKOptions) {
        this._options = options;
        this._axios = axios.create(options);
    }

    static isPermitted = (scope: string, permission?: string): boolean => {
        return true;
    }

    static checkPermission(scope: string, permission?: string) {
        if(!this.isPermitted(scope, permission))
            throw new Error(`You are not authorized to perform this action! Missing permission '${scope}.${permission}'!`);
    }

    static resolveAxiosResponse<T>(executor: () => Promise<AxiosResponse<T>>) {
        const verifyData = (res: AxiosResponse) => {
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
                return new Promise<T>((resolve, reject) =>
                    executors.raw
                        .then((res) => {
                            try {
                                resolve(verifyData(res));
                            } catch (err) {
                                reject(err);
                            }
                        })
                        .catch((err) => reject(err))
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

    static extensions = {
        oauth: oauthEntry,
    }
}
