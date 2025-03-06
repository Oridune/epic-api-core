"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsModule = void 0;
const accountsModule = (sdk) => ({
    updateLogo(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "updateLogo");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/accounts/logo/:account/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("accounts", "create");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/accounts/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    update(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "update");
            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/accounts/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("accounts", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/accounts/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("accounts", "get");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/accounts/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    toggleBlocked(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "toggleBlocked");
            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/accounts/toggle/blocked/:id/:isBlocked/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.accountsModule = accountsModule;
