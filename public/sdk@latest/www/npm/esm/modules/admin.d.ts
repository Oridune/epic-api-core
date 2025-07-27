import type { TRequestOptions, TRequestExecutors, TResponseShape } from "../types.js";
export type TRoute$admin$updateCore = {
    query: {};
    params: {};
    body: {
        template?: string;
    };
    return: {
        status: boolean;
        data: undefined;
    };
};
export interface IController$admin {
    updateCore<Method extends "patch", QueryShape extends TRoute$admin$updateCore["query"], ParamsShape extends TRoute$admin$updateCore["params"], BodyShape extends TRoute$admin$updateCore["body"], ReturnShape extends TResponseShape<any> = TRoute$admin$updateCore["return"]>(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}
export declare const adminModule: (sdk: any) => IController$admin;
//# sourceMappingURL=admin.d.ts.map