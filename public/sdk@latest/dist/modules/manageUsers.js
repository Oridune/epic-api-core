"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageUsersModule = void 0;
const manageUsersModule = (sdk) => ({
    updatePassword(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageUsers", "updatePassword");
            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/manage/users/password/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.manageUsersModule = manageUsersModule;
