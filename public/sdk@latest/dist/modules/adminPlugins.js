"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPluginsModule = void 0;
const adminPluginsModule = (sdk) => ({
    toggleEnable(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("adminPlugins", "toggleEnable");
            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/admin/plugins/toggle/plugin/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("adminPlugins", "list");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/admin/plugins/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    add(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("adminPlugins", "add");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/admin/plugins/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("adminPlugins", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/admin/plugins/:name/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.adminPluginsModule = adminPluginsModule;
