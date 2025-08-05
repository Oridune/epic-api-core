export const oauthPasskeyModule = (sdk) => {
    const methods = {
        challengeLogin(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauthPasskey", "challengeLogin");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/passkey/challenge/login").replace(/:\w+\?\/?/g, "");
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
        challengeRegister(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauthPasskey", "challengeRegister");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/passkey/challenge/register").replace(/:\w+\?\/?/g, "");
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
        login(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauthPasskey", "login");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/passkey/login").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "post" ?? "get",
                    url,
                    params: data?.query,
                    data: data?.body,
                    signal: data?.signal,
                    ...data?.axiosConfig,
                });
                return res;
            }, data);
        },
        register(data) {
            return sdk.resolveAxiosResponse(async () => {
                if (!sdk._axios)
                    throw new Error("Axios not initialized!");
                sdk.checkPermission("oauthPasskey", "register");
                const url = Object.entries(data?.params ?? {}).reduce((endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value), "/api/oauth/passkey/register").replace(/:\w+\?\/?/g, "");
                const res = await sdk._axios.request({
                    method: data?.method ?? "post" ?? "get",
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
    methods.challengeLogin.__permission = "oauthPasskey.challengeLogin";
    methods.challengeRegister.__permission = "oauthPasskey.challengeRegister";
    methods.login.__permission = "oauthPasskey.login";
    methods.register.__permission = "oauthPasskey.register";
    return methods;
};
