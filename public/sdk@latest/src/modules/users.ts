import type { ObjectId, TRequestOptions, TRequestExecutors, TResponseShape } from "../types";





export type TRoute$users$updateAvatar = {
    query: {
		name?: string;
		alt?: string;
		contentType: "image/png" | "image/jpg" | "image/jpeg" | "image/svg+xml" | "image/webp";
		contentLength: number;
} & { [K: string]: any }
,
    params: {
} & { [K: string]: string }
,
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$setFcmToken = {
    query: {},
    params: {},
    body: {
		token: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$deleteFcmToken = {
    query: {
		token: string;
},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$updateEmail = {
    query: {},
    params: {},
    body: {
		email: string;
},
    return: {
		status: boolean;
		data: {
		type: "email" | "phone" | "in-app";
		value: string;
		verified: boolean;
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




export type TRoute$users$update = {
    query: {},
    params: {},
    body: {
		fname?: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
},
    return: {
		status: boolean;
		data: {
		username?: string;
		password?: string;
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		tags?: Array<string>;
		email?: string;
		phone?: string;
		fname?: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		oauthApp?: ObjectId;
		reference?: string;
		passwordHistory?: Array<string>;
		locationHistory?: Array<{
		type?: "Point" | (string & {});
		coordinates: [number,number];
}>;
		role?: string;
		isEmailVerified?: boolean;
		isPhoneVerified?: boolean;
		lastLogin?: Date;
		loginCount?: number;
		failedLoginAttempts?: number;
		fcmDeviceTokens?: Array<string>;
		passkeys?: Array<{
		id: string;
		publicKey: string;
		counter: number;
		deviceType: string;
		backedUp: boolean;
		transports: Array<string>;
		timestamp?: Date;
}>;
		passkeyEnabled?: boolean;
		isBlocked?: boolean;
		collaborates?: Array<ObjectId>;
		deletionAt: Date | null;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
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




export type TRoute$users$me = {
    query: {},
    params: {},
    body: {},
    return: {
		status: boolean;
		data: {
		user: {
		collaborates: Array<{
		account: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		isBlocked?: boolean;
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
};
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		role?: string;
		isOwned: boolean;
		isPrimary: boolean;
		isBlocked?: boolean;
}>;
		username: string;
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		tags?: Array<string>;
		email?: string;
		phone?: string;
		fname: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		oauthApp: ObjectId;
		reference?: string;
		locationHistory?: Array<{
		type?: "Point" | (string & {});
		coordinates: [number,number];
}>;
		role: string;
		isEmailVerified?: boolean;
		isPhoneVerified?: boolean;
		lastLogin?: Date;
		loginCount?: number;
		failedLoginAttempts?: number;
		passkeyEnabled?: boolean;
		isBlocked?: boolean;
		deletionAt: Date | null;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
};
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




export type TRoute$users$updatePassword = {
    query: {},
    params: {},
    body: {
		method: "email" | "phone" | "in-app";
		token: string;
		code: number;
		password: string;
		hashedPassword?: any;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$updatePhone = {
    query: {},
    params: {},
    body: {
		phone: string;
},
    return: {
		status: boolean;
		data: {
		type: "email" | "phone" | "in-app";
		value: string;
		verified: boolean;
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




export type TRoute$users$verify = {
    query: {},
    params: {},
    body: {
		method: "email" | "phone" | "in-app";
		token: string;
		code: number;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$delete = {
    query: {
		deletionTimeoutMs?: number;
},
    params: {},
    body: {},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$updateRole = {
    query: {},
    params: {
		id?: string;
},
    body: {
		role: string;
},
    return: { status: boolean; data: undefined },
};




export type TRoute$users$get = {
    query: {
		search?: string;
		range?: [Date,Date];
		offset?: number;
		limit?: number;
		sort?: /*(optional default:[object Object])*/{
} & { [K: string]: number }
;
		project?: /*(optional)*/{
} & { [K: string]: number }
;
		includeTotalCount?: boolean;
},
    params: {
		id?: string;
},
    body: {},
    return: {
		status: boolean;
		data: {
		totalCount?: number;
		users: Array<{
		username: string;
		password: string;
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		tags?: Array<string>;
		email?: string;
		phone?: string;
		fname: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		oauthApp: ObjectId;
		reference?: string;
		passwordHistory: Array<string>;
		locationHistory?: Array<{
		type?: "Point" | (string & {});
		coordinates: [number,number];
}>;
		role: string;
		isEmailVerified?: boolean;
		isPhoneVerified?: boolean;
		lastLogin?: Date;
		loginCount?: number;
		failedLoginAttempts?: number;
		fcmDeviceTokens?: Array<string>;
		passkeys?: Array<{
		id: string;
		publicKey: string;
		counter: number;
		deviceType: string;
		backedUp: boolean;
		transports: Array<string>;
		timestamp?: Date;
}>;
		passkeyEnabled?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}>;
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




export type TRoute$users$create = {
    query: {
		reference?: any;
},
    params: {
		oauthAppId: string;
		oauthApp?: any;
},
    body: {
		username: string;
		password: string;
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		tags?: Array<string>;
		email?: string;
		phone?: string;
		fname: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
},
    return: {
		status: boolean;
		data: {
		user: {
		username: string;
		password: string;
		avatar?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		tags?: Array<string>;
		email?: string;
		phone?: string;
		fname: string;
		mname?: string;
		lname?: string;
		gender: "male" | "female" | "other";
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		oauthApp: ObjectId;
		reference?: string;
		passwordHistory: Array<string>;
		locationHistory?: Array<{
		type?: "Point" | (string & {});
		coordinates: [number,number];
}>;
		role: string;
		isEmailVerified?: boolean;
		isPhoneVerified?: boolean;
		lastLogin?: Date;
		loginCount?: number;
		failedLoginAttempts?: number;
		fcmDeviceTokens?: Array<string>;
		passkeys?: Array<{
		id: string;
		publicKey: string;
		counter: number;
		deviceType: string;
		backedUp: boolean;
		transports: Array<string>;
		timestamp?: Date;
}>;
		passkeyEnabled?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
};
		account: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		logo?: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		isBlocked?: boolean;
		name?: string;
		description?: string;
		email?: string;
		phone?: string;
};
		collaborator: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		role?: string;
		isOwned: boolean;
		isPrimary: boolean;
		account: ObjectId;
		isBlocked?: boolean;
};
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




export type TRoute$users$toggleBlocked = {
    query: {},
    params: {
		id: string;
		isBlocked: boolean;
},
    body: {},
    return: { status: boolean; data: undefined },
};


export interface IController$users {
    updateAvatar(): TRequestExecutors<TRoute$users$updateAvatar["return"]>;
    updateAvatar<
        Method extends "get",
        QueryShape extends TRoute$users$updateAvatar["query"],
        ParamsShape extends TRoute$users$updateAvatar["params"],
        BodyShape extends TRoute$users$updateAvatar["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updateAvatar["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updateAvatar<
        Method extends "delete",
        QueryShape extends TRoute$users$updateAvatar["query"],
        ParamsShape extends TRoute$users$updateAvatar["params"],
        BodyShape extends TRoute$users$updateAvatar["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updateAvatar["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updateAvatar<
        Method extends "put",
        QueryShape extends TRoute$users$updateAvatar["query"],
        ParamsShape extends TRoute$users$updateAvatar["params"],
        BodyShape extends TRoute$users$updateAvatar["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updateAvatar["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    setFcmToken<
        Method extends "put",
        QueryShape extends TRoute$users$setFcmToken["query"],
        ParamsShape extends TRoute$users$setFcmToken["params"],
        BodyShape extends TRoute$users$setFcmToken["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$setFcmToken["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    deleteFcmToken<
        Method extends "delete",
        QueryShape extends TRoute$users$deleteFcmToken["query"],
        ParamsShape extends TRoute$users$deleteFcmToken["params"],
        BodyShape extends TRoute$users$deleteFcmToken["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$deleteFcmToken["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updateEmail<
        Method extends "put",
        QueryShape extends TRoute$users$updateEmail["query"],
        ParamsShape extends TRoute$users$updateEmail["params"],
        BodyShape extends TRoute$users$updateEmail["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updateEmail["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    update<
        Method extends "patch",
        QueryShape extends TRoute$users$update["query"],
        ParamsShape extends TRoute$users$update["params"],
        BodyShape extends TRoute$users$update["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$update["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    me(): TRequestExecutors<TRoute$users$me["return"]>;
    me<
        Method extends "get",
        QueryShape extends TRoute$users$me["query"],
        ParamsShape extends TRoute$users$me["params"],
        BodyShape extends TRoute$users$me["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$me["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updatePassword<
        Method extends "put",
        QueryShape extends TRoute$users$updatePassword["query"],
        ParamsShape extends TRoute$users$updatePassword["params"],
        BodyShape extends TRoute$users$updatePassword["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updatePassword["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updatePhone<
        Method extends "put",
        QueryShape extends TRoute$users$updatePhone["query"],
        ParamsShape extends TRoute$users$updatePhone["params"],
        BodyShape extends TRoute$users$updatePhone["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updatePhone["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    verify<
        Method extends "post",
        QueryShape extends TRoute$users$verify["query"],
        ParamsShape extends TRoute$users$verify["params"],
        BodyShape extends TRoute$users$verify["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$verify["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    delete<
        Method extends "delete",
        QueryShape extends TRoute$users$delete["query"],
        ParamsShape extends TRoute$users$delete["params"],
        BodyShape extends TRoute$users$delete["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$delete["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    updateRole<
        Method extends "patch",
        QueryShape extends TRoute$users$updateRole["query"],
        ParamsShape extends TRoute$users$updateRole["params"],
        BodyShape extends TRoute$users$updateRole["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$updateRole["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    get(): TRequestExecutors<TRoute$users$get["return"]>;
    get<
        Method extends "get",
        QueryShape extends TRoute$users$get["query"],
        ParamsShape extends TRoute$users$get["params"],
        BodyShape extends TRoute$users$get["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$get["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    create<
        Method extends "post",
        QueryShape extends TRoute$users$create["query"],
        ParamsShape extends TRoute$users$create["params"],
        BodyShape extends TRoute$users$create["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$create["return"],
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
    toggleBlocked<
        Method extends "patch",
        QueryShape extends TRoute$users$toggleBlocked["query"],
        ParamsShape extends TRoute$users$toggleBlocked["params"],
        BodyShape extends TRoute$users$toggleBlocked["body"],
        ReturnShape extends TResponseShape<any> = TRoute$users$toggleBlocked["return"],
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions<ReturnShape>): TRequestExecutors<ReturnShape, BodyShape>;
}

export const usersModule = (sdk: any): IController$users => ({

    updateAvatar(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateAvatar");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/avatar/sign"
            ).replace(/:\w+\?\/?/g, "");

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

    setFcmToken(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "setFcmToken");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/fcm/token"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    deleteFcmToken(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "deleteFcmToken");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/fcm/token"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    updateEmail(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateEmail");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/email"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    update(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "update");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/me"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    me(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "me");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/me"
            ).replace(/:\w+\?\/?/g, "");

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

    updatePassword(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updatePassword");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/password"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    updatePhone(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updatePhone");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/phone"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "put" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    verify(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "verify");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/verify"
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

    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "delete");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    updateRole(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateRole");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/role/:id"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
                url,
                params: data?.query,
                data: data?.body,
                signal: data?.signal,
                ...data?.axiosConfig,
            });

            return res;
        }, data);
    },

    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "get");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/:id?"
            ).replace(/:\w+\?\/?/g, "");

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

    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "create");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/:oauthAppId"
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

    toggleBlocked(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "toggleBlocked");

            const url = Object.entries<string>(data?.params ?? {}).reduce(
                (endpoint, [key, value]) => endpoint.replace(new RegExp(`:${key}\\??`, "g"), value),
                "/api/users/toggle/blocked/:id/:isBlocked"
            ).replace(/:\w+\?\/?/g, "");

            const res = await sdk._axios.request({
                method: data?.method ?? "patch" ?? "get",
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