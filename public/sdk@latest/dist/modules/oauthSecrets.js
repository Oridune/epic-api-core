"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthSecretsModule = void 0;
const oauthSecretsModule = (sdk) => ({
    createFor(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthSecrets", "createFor");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/behalf/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthSecrets", "create");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/secrets/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    delete(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthSecrets", "delete");
            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/secrets/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    get(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("oauthSecrets", "get");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/secrets/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.oauthSecretsModule = oauthSecretsModule;
