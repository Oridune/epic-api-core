"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthEntry = void 0;
const __1 = require("../../../");
const base64_arraybuffer_1 = require("base64-arraybuffer");
const js_sha256_1 = require("js-sha256");
const securityGuard_1 = require("./lib/securityGuard");
class oauthEntry {
    static auth;
    static guard;
    static selectedAccount;
    static _authInterceptorAdded = false;
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
            method: "sha-256",
            challenge: (0, base64_arraybuffer_1.encode)(js_sha256_1.sha256.arrayBuffer(verifier))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, ""),
        };
    }
    static async onLogin() {
        if (!this._authInterceptorAdded) {
            __1.EpicSDK._axios.interceptors.request.use(async (config) => {
                if (!config.headers["Authorization"] && this.auth) {
                    const timeInSeconds = Date.now() / 1000;
                    if (this.auth.access.expiresAtSeconds <= timeInSeconds) {
                        if (!this.auth.refresh ||
                            this.auth.refresh.expiresAtSeconds <=
                                timeInSeconds) {
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
                    config.headers["X-Api-Version"] = __1.EpicSDK._apiVersion;
                    if (this.selectedAccount) {
                        config.headers["X-Account-ID"] =
                            this.selectedAccount;
                    }
                }
                return config;
            });
            this._authInterceptorAdded = true;
        }
        await this.registerPermissions();
    }
    static async registerPermissions() {
        const { scopePipeline } = await __1.EpicSDK.oauthPolicies.me().data;
        this.guard = new securityGuard_1.SecurityGuard().load({
            scopePipeline: scopePipeline.map(($) => new Set($)),
        });
        __1.EpicSDK.isPermitted = this.guard.isPermitted.bind(this.guard);
    }
    static oauth2Login(appId, opts) {
        const { verifier, method, challenge } = this.generateCodeChallenge();
        const url = new URL(`/oauth/login
            ?appId=${appId}
            &codeChallengeMethod=${method}
            &codeChallenge=${challenge}
            &callbackURL=${opts.callbackUrl}
            &state=${btoa(JSON.stringify(opts.state))}
            &theme=${opts.theme ?? "system"}
            &lng=${opts.lng ?? "en"}
            ${opts.username ? `&username=${opts.username}` : ""}`.replace(/\s*/g, ""), __1.EpicSDK._options?.axiosConfig?.baseURL).toString();
        return {
            verifier,
            url,
        };
    }
    static async login(appId, opts) {
        const authorization = await __1.EpicSDK.getCache("authorization");
        if (authorization) {
            this.auth = authorization.value;
            await this.onLogin();
            return;
        }
        exchangeCode: if (typeof opts?.code === "string") {
            const verifier = await __1.EpicSDK.getCache("verifier");
            if (!verifier)
                break exchangeCode;
            const authorization = await this.fetchAccessToken(opts.code, verifier.value);
            await __1.EpicSDK.setCache("authorization", authorization);
            return;
        }
        const { verifier, url } = this.oauth2Login(appId, opts);
        await __1.EpicSDK.setCache("verifier", verifier);
        opts.onRedirect(url);
    }
    static async fetchAccessToken(code, verifier, opts) {
        this.auth = await __1.EpicSDK.oauth.exchangeCode({
            body: {
                code,
                codeVerifier: verifier,
                fcmDeviceToken: opts?.deviceToken,
                geoPoint: opts?.geoPoint,
            },
        }).data;
        await this.onLogin();
        return this.auth;
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
    static async logout(allDevices = false, fcmDeviceToken) {
        await __1.EpicSDK.delCache("authorization");
        await __1.EpicSDK.delCache("verifier");
        await __1.EpicSDK.oauth.logout({ query: { allDevices, fcmDeviceToken } })
            .raw;
    }
}
exports.oauthEntry = oauthEntry;
