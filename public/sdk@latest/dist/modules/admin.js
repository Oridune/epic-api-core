"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModule = void 0;
const adminModule = (sdk) => ({
    updateCore(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("admin", "updateCore");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/admin/core").replace(/:\w+\?\/?/g, "");
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
exports.adminModule = adminModule;
