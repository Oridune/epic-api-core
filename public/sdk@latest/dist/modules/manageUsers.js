"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageUsersModule = void 0;
const manageUsersModule = (sdk) => ({
    updatePassword(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageUsers", "updatePassword");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/manage/users/password/:id").replace(/:\w+\?\//g, "");
            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.manageUsersModule = manageUsersModule;
