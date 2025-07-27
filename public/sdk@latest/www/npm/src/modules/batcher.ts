import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";





export type TRoute$batcher$request = {
    query: {},
    params: {},
    body: {
		requests: Array<Array<{
		endpoint?: string;
		method: "get" | "post" | "patch" | "put" | "delete" | "options";
		headers?: /*(optional)*/{
} & { [K: string]: string }
;
		body?: any;
		disabled?: boolean;
} | string> | {
		endpoint?: string;
		method: "get" | "post" | "patch" | "put" | "delete" | "options";
		headers?: /*(optional)*/{
} & { [K: string]: string }
;
		body?: any;
		disabled?: boolean;
} | string>;
},
    return: {
		status: boolean;
		data: {
		responses: Array<any | undefined>;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics?: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
},
};


export interface IController$batcher {
    request<
        Method extends "post",
        QueryShape extends TRoute$batcher$request["query"],
        ParamsShape extends TRoute$batcher$request["params"],
        BodyShape extends TRoute$batcher$request["body"],
        ReturnShape extends TResponseShape<any> = TRoute$batcher$request["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const batcherModule = (sdk: any): IController$batcher => ({

    request(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("batcher", "request");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/batcher"
            ).replace(/:\w+\?\/?/g, "");

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

});