/**
 * Copyright © Oridune 2025
 *
 * This is a generated file. Do not edit the contents of this file!
 */
import { AxiosInstance, AxiosResponse } from "axios";
import type { TSDKOptions } from "./types";
import { oauthEntry } from "./extensions/oauth/src/entry";
export declare class EpicSDK {
    static _apiVersion: string;
    static _options?: TSDKOptions;
    static _axios?: AxiosInstance;
    static init(options: TSDKOptions): void;
    static isPermitted: (scope: string, permission?: string) => boolean;
    static checkPermission(scope: string, permission?: string): void;
    static resolveAxiosResponse<T>(executor: () => Promise<AxiosResponse<T>>): {
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
    static extensions: {
        oauth: typeof oauthEntry;
    };
}
