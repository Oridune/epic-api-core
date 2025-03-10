"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiModule = void 0;
const apiModule = (sdk) => ({
    memoryUsage(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("api", "memoryUsage");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/memory/usage/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    postman(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("api", "postman");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/postman/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    test(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("api", "test");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/test/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    home(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("api", "home");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    heapSnapshot(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("api", "heapSnapshot");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/heap/snapshot/:filename?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.apiModule = apiModule;
