"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthEntry = void 0;
const __1 = require("../../../");
const base64_arraybuffer_1 = require("base64-arraybuffer");
const js_sha256_1 = require("js-sha256");
class oauthEntry {
    static auth;
    static _refreshRequest;
    static generateRandomString(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    static generateCodeChallenge() {
        const verifier = this.generateRandomString(128);
        return {
            verifier,
            method: "sha256",
            challenge: (0, base64_arraybuffer_1.encode)(js_sha256_1.sha256.arrayBuffer(verifier))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, ""),
        };
    }
    static oauth2Login(appId, opts) {
        __1.EpicSDK.axios?.interceptors.request.use(async (config) => {
            if (!config.headers["Authorization"] && this.auth) {
                const timeInSeconds = Date.now() / 1000;
                if (this.auth.access.expiresAtSeconds <= timeInSeconds) {
                    if (!this.auth.refresh ||
                        this.auth.refresh.expiresAtSeconds <= timeInSeconds) {
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
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        const { verifier, method, challenge } = this.generateCodeChallenge();
        const url = new URL(`/oauth/login
            ?appId=${appId}
            &codeChallengeMethod=${method}
            &codeChallenge=${challenge}
            &callbackURL=${opts.callbackUrl}
            &state=${btoa(JSON.stringify(opts.state))}
            &theme=${opts.theme}
            &lng=${opts.lng}
            ${opts.username ? `&username=${opts.username}` : ""}`, __1.EpicSDK.options?.baseURL).toString();
        return {
            verifier,
            url,
        };
    }
    static async getAccessToken(code, verifier, opts) {
        this.auth = await __1.EpicSDK.oauth.exchangeCode({
            body: {
                code,
                codePayload: undefined,
                codeVerifier: verifier,
                fcmDeviceToken: opts.deviceToken,
            },
        }).data;
    }
    static async refreshAccessToken(refreshToken) {
        //! this._refreshRequest is used to stop bubbling do not remove it!
        this.auth = await (this._refreshRequest ??= __1.EpicSDK.oauth.refresh({
            body: {
                refreshToken,
                refreshTokenPayload: undefined,
            },
        }).data);
    }
}
exports.oauthEntry = oauthEntry;
