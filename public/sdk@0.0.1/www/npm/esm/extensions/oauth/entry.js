import { EpicSDK } from "../../index.js";
import { encode as base64encode } from "base64-arraybuffer";
import { sha256 } from "js-sha256";
import { SecurityGuard } from "./lib/securityGuard.js";
export class oauthEntry {
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
            challenge: base64encode(sha256.arrayBuffer(verifier))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, ""),
        };
    }
    static async onLogin() {
        if (!this._authInterceptorAdded) {
            EpicSDK._axios.interceptors.request.use(async (config) => {
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
                    config.headers["X-Api-Version"] = EpicSDK._apiVersion;
                    if (this.selectedAccount) {
                        config.headers["X-Account-ID"] = this.selectedAccount;
                    }
                }
                return config;
            });
            this._authInterceptorAdded = true;
        }
        await this.registerPermissions();
    }
    static async registerPermissions() {
        const { scopePipeline } = await EpicSDK.oauthPolicies.me().data;
        this.guard = new SecurityGuard().load({
            scopePipeline: scopePipeline.map(($) => new Set($)),
        });
        EpicSDK.isPermitted = (scope, permission) => this.guard.isPermitted((typeof scope === "function" ? scope.__permission : scope) ?? "", permission);
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
            ${opts.username ? `&username=${opts.username}` : ""}`.replace(/\s*/g, ""), EpicSDK._options?.axiosConfig?.baseURL).toString();
        return {
            verifier,
            url,
        };
    }
    static async login(appId, opts) {
        const authorization = await EpicSDK.getCache("authorization");
        if (authorization) {
            this.auth = authorization.value;
            await this.onLogin();
            return authorization.value;
        }
        exchangeCode: if (typeof opts?.code === "string") {
            const verifier = await EpicSDK.getCache("verifier");
            if (!verifier)
                break exchangeCode;
            const authorization = await this.fetchAccessToken(opts.code, verifier.value);
            await EpicSDK.setCache("authorization", authorization);
            return authorization;
        }
        const { verifier, url } = this.oauth2Login(appId, opts);
        await EpicSDK.setCache("verifier", verifier);
        opts.onRedirect(url);
    }
    static async fetchAccessToken(code, verifier, opts) {
        this.auth = await EpicSDK.oauth.exchangeCode({
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
        this.auth = await (this._refreshRequest ??= EpicSDK.oauth.refresh({
            body: {
                refreshToken,
                refreshTokenPayload: undefined,
            },
        }).data);
    }
    static async switchAccount(accountId) {
        this.selectedAccount = accountId;
        await Promise.all([
            this.registerPermissions(),
            EpicSDK.setCache("selectedAccount", accountId),
        ]);
    }
    static async logout(allDevices = false, fcmDeviceToken) {
        await Promise.all([
            EpicSDK.delCache("authorization"),
            EpicSDK.delCache("verifier"),
            EpicSDK.delCache("selectedAccount"),
        ]);
        await EpicSDK.oauth.logout({ query: { allDevices, fcmDeviceToken } })
            .raw;
    }
}
Object.defineProperty(oauthEntry, "_authInterceptorAdded", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
