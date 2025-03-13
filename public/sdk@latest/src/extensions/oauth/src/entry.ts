import { EpicSDK } from "../../../";

import { encode as base64encode } from "base64-arraybuffer";
import { sha256 } from "js-sha256";

export type TAuthToken<T extends "oauth_refresh_token" | "oauth_access_token"> =
    {
        issuer: string;
        type: T;
        token: string;
        expiresAtSeconds: number;
    };

export type TAuthorization = {
    refresh: TAuthToken<"oauth_refresh_token">;
    access: TAuthToken<"oauth_access_token">;
};

export class oauthEntry {
    static selectedAccount?: string;
    static auth?: TAuthorization;

    protected static _refreshRequest?: Promise<TAuthorization>;

    protected static generateRandomString(length: number): string {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    protected static generateCodeChallenge() {
        const verifier = this.generateRandomString(128);

        return {
            verifier,
            method: "sha256",
            challenge: base64encode(sha256.arrayBuffer(verifier))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, ""),
        };
    }

    static oauth2Login(
        appId: string,
        opts: {
            callbackUrl: string;
            theme?: "dark" | "light" | "system";
            lng?: string;
            username?: string;
            state?: Record<string, any>;
        },
    ) {
        const { verifier, method, challenge } = this.generateCodeChallenge();

        const url = new URL(
            `/oauth/login
            ?appId=${appId}
            &codeChallengeMethod=${method}
            &codeChallenge=${challenge}
            &callbackURL=${opts.callbackUrl}
            &state=${btoa(JSON.stringify(opts.state))}
            &theme=${opts.theme}
            &lng=${opts.lng}
            ${opts.username ? `&username=${opts.username}` : ""}`,
            EpicSDK._options?.axiosConfig?.baseURL,
        ).toString();

        return {
            verifier,
            url,
        };
    }

    static async getAccessToken(code: string, verifier: string, opts: {
        deviceToken?: string;
    }) {
        this.auth = await EpicSDK.oauth.exchangeCode({
            body: {
                code,
                codePayload: undefined,
                codeVerifier: verifier,
                fcmDeviceToken: opts.deviceToken,
            },
        }).data as TAuthorization;

        EpicSDK._axios?.interceptors.request.use(
            async (config) => {
                if (!config.headers["Authorization"] && this.auth) {
                    const timeInSeconds = Date.now() / 1000;

                    if (this.auth.access.expiresAtSeconds <= timeInSeconds) {
                        if (
                            !this.auth.refresh ||
                            this.auth.refresh.expiresAtSeconds <= timeInSeconds
                        ) {
                            throw new Error("Access token expired!");
                        }

                        await this.refreshAccessToken(this.auth.refresh.token);

                        //! this._refreshRequest is used to stop bubbling do not remove it!
                        setTimeout(() => {
                            delete this._refreshRequest;
                        }, 1000);
                    }

                    config.headers["Authorization"] =
                        `Bearer ${this.auth.access.token}`;

                    config.headers["X-Account-ID"] = EpicSDK._apiVersion;

                    if (this.selectedAccount) {
                        config.headers["X-Account-ID"] = this.selectedAccount;
                    }
                }

                return config;
            },
        );
    }

    static async refreshAccessToken(refreshToken: string) {
        //! this._refreshRequest is used to stop bubbling do not remove it!
        this.auth = await (this._refreshRequest ??= EpicSDK.oauth.refresh({
            body: {
                refreshToken,
                refreshTokenPayload: undefined,
            },
        }).data as Promise<TAuthorization>);
    }
}
