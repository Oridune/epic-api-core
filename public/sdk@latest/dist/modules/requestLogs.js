"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogsModule = void 0;
const requestLogsModule = (sdk) => ({
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("requestLogs", "create");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/request/logs/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("requestLogs", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/request/logs/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("requestLogs", "get");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/request/logs/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.requestLogsModule = requestLogsModule;
