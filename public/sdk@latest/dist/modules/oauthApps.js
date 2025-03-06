"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthAppsModule = void 0;
const oauthAppsModule = (sdk) => ({
    getDefault(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "getDefault");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/default/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "create");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/apps/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    list(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "list");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    getDetails(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "getDetails");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/details/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    get(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "get");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    delete(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthApps", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/apps/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.oauthAppsModule = oauthAppsModule;
