"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsModule = void 0;
const uploadsModule = (sdk) => ({
    sign(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("uploads", "sign");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/sign/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    upload(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("uploads", "upload");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/uploads/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.uploadsModule = uploadsModule;
