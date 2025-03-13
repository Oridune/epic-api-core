"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthModule = void 0;
const oauthModule = (sdk) => ({
    quickLogin(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "quickLogin");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/local/quick/login/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    exchangeAuthentication(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "exchangeAuthentication");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/exchange/authentication/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    exchangeCode(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "exchangeCode");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/exchange/code/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    authenticate(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "authenticate");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/local/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    logout(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "logout");
            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/logout/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    createPermit(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "createPermit");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/permit/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    refresh(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauth", "refresh");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/refresh/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.oauthModule = oauthModule;
