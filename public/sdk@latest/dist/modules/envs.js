"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envsModule = void 0;
const envsModule = (sdk) => ({
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("envs", "create");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/envs/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("envs", "update");
            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("envs", "delete");
            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/envs/:id/${Object.values(data?.params ?? {}).join("/")}`,
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
            sdk.checkPermission("envs", "get");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/envs/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.envsModule = envsModule;
