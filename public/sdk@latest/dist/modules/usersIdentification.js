"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersIdentificationModule = void 0;
const usersIdentificationModule = (sdk) => ({
    methods(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("usersIdentification", "methods");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/identification/methods/me/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    publicMethods(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("usersIdentification", "publicMethods");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/identification/methods/:username/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    request(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("usersIdentification", "request");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/identification/:purpose/:username/:method/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.usersIdentificationModule = usersIdentificationModule;
