"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaboratorsModule = void 0;
const collaboratorsModule = (sdk) => ({
    update(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("collaborators", "update");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/collaborators/:id").replace(/:\w+\?\//g, "");
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
            sdk.checkPermission("collaborators", "delete");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/collaborators/:id").replace(/:\w+\?\//g, "");
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
            sdk.checkPermission("collaborators", "get");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/collaborators/:id?").replace(/:\w+\?\//g, "");
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
            sdk.checkPermission("collaborators", "create");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/collaborators/:token").replace(/:\w+\?\//g, "");
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
    toggleBlocked(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("collaborators", "toggleBlocked");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/collaborators/toggle/blocked/:id/:isBlocked").replace(/:\w+\?\//g, "");
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
exports.collaboratorsModule = collaboratorsModule;
