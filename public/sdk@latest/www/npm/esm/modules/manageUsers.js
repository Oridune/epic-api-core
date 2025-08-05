export const manageUsersModule = (sdk) => {
    const methods = {
        updatePassword(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("manageUsers", "updatePassword");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/manage/users/password/:id").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "put" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
    };
    methods.updatePassword.__permission = "manageUsers.updatePassword";
    return methods;
};
