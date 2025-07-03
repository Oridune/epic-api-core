"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsModule = void 0;
const accountsModule = (sdk) => ({
    updateLogo(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "updateLogo");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts/logo/:account").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url,
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
            sdk.checkPermission("accounts", "create");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    update(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "update");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts/:id").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
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
            sdk.checkPermission("accounts", "delete");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts/:id").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url,
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
            sdk.checkPermission("accounts", "get");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts/:id?").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    toggleBlocked(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accounts", "toggleBlocked");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/accounts/toggle/blocked/:id/:isBlocked").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.accountsModule = accountsModule;
