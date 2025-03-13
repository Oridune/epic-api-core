import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$batcher$request = {
    query: {},
    params: {},
    body: {
		requests: Array<Array<{
		endpoint?: string;
		method: string;
		headers?: /*(optional)*/{
} & { [K: string]: string }
;
		body?: any;
		disabled?: boolean;
} | string> | {
		endpoint?: string;
		method: string;
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
		responses: Array<any>;
};
		messages?: Array<{
		message?: string;
		location?: string;
		name?: string;
} & { [K: string]: any }
>;
		metrics: /*(optional)*/{
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

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/batcher/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

});