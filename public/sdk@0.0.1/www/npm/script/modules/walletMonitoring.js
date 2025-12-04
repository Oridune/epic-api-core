"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletMonitoringModule = void 0;
const walletMonitoringModule = (sdk) => {
    const methods = {
        getAllNegative(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("walletMonitoring", "getAllNegative");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""), "/api/wallet/monitoring/all/negative/:id?").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "get" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
        getNegative(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("walletMonitoring", "getNegative");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value ?? ""), "/api/wallet/monitoring/negative/:id?").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "get" ?? "get",
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
    methods.getAllNegative.__permission = "walletMonitoring.getAllNegative";
    methods.getNegative.__permission = "walletMonitoring.getNegative";
    return methods;
};
exports.walletMonitoringModule = walletMonitoringModule;
