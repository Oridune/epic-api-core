"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModule = void 0;
const adminModule = (sdk) => ({
    updateCore(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("admin", "updateCore");
            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/admin/core/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.adminModule = adminModule;
