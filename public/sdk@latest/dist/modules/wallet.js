"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletModule = void 0;
const walletModule = (sdk) => ({
    balanceList(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "balanceList");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/wallet/balance/list/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    metadata(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "metadata");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/metadata/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    transfer(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "transfer");
            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/wallet/transfer/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    signTransfer(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "signTransfer");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/transfer/sign/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    balance(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "balance");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/balance/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
    transactions(data) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios)
                throw new Error("Axios not initialized!");
            sdk.checkPermission("wallet", "transactions");
            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/wallet/transactions/:type?/:currency?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });
            return res;
        }, data);
    },
});
exports.walletModule = walletModule;
