"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batcherModule = void 0;
const batcherModule = (sdk) => ({
    request(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("batcher", "request");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/batcher/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.batcherModule = batcherModule;
