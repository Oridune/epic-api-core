export const uploadsModule = (sdk) => {
    const methods = {
        sign(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("uploads", "sign");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/uploads/sign").replace(/:\w+\?\/?/g, "");
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
        upload(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("uploads", "upload");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/uploads").replace(/:\w+\?\/?/g, "");
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
    methods.sign.__permission = "uploads.sign";
    methods.upload.__permission = "uploads.upload";
    return methods;
};
