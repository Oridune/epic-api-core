"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountInvitesModule = void 0;
const accountInvitesModule = (sdk) => ({
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accountInvites", "create");
            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/account/invites/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    delete(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accountInvites", "delete");
            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/account/invites/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    get(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accountInvites", "get");
            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/account/invites/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.accountInvitesModule = accountInvitesModule;
