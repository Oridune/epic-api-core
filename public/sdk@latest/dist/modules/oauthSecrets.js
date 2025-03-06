"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthSecretsModule = void 0;
const oauthSecretsModule = (sdk) => ({
    createFor(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthSecrets", "createFor");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/behalf/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("oauthSecrets", "create");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("oauthSecrets", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/secrets/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("oauthSecrets", "get");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/secrets/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.oauthSecretsModule = oauthSecretsModule;
