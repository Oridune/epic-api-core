"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageWalletsModule = void 0;
const manageWalletsModule = (sdk) => ({
    balanceList(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageWallets", "balanceList");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/manage/wallets/balance/list/:accountId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    getAll(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageWallets", "getAll");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/manage/wallets/all/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    refund(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageWallets", "refund");
            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/manage/wallets/refund/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    charge(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageWallets", "charge");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/manage/wallets/charge/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
    transactions(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("manageWallets", "transactions");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/manage/wallets/transactions/:accountId/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        });
    },
});
exports.manageWalletsModule = manageWalletsModule;
