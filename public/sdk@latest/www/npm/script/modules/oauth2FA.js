"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth2FAModule = void 0;
const oauth2FAModule = (sdk) => {
    const methods = {
        activateTOTP(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauth2FA", "activateTOTP");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/2fa/totp/activate").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "post" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
        authorizeTOTP(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauth2FA", "authorizeTOTP");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/2fa/totp/authorize").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "post" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
        createTOTP(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauth2FA", "createTOTP");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/2fa/totp").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "post" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
        getTOTP(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauth2FA", "getTOTP");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/2fa/totp").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "get" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
    };
    methods.activateTOTP.__permission = "oauth2FA.activateTOTP";
    methods.authorizeTOTP.__permission = "oauth2FA.authorizeTOTP";
    methods.createTOTP.__permission = "oauth2FA.createTOTP";
    methods.getTOTP.__permission = "oauth2FA.getTOTP";
    return methods;
};
exports.oauth2FAModule = oauth2FAModule;
