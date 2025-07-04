"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountInvitesModule = void 0;
const accountInvitesModule = (sdk) => ({
    create(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accountInvites", "create");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/account/invites").replace(/:\w+\?\/?/g, "");
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
    delete(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("accountInvites", "delete");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/account/invites/:id").replace(/:\w+\?\/?/g, "");
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
            sdk.checkPermission("accountInvites", "get");
            const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/account/invites/:id?").replace(/:\w+\?\/?/g, "");
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
});
exports.accountInvitesModule = accountInvitesModule;
