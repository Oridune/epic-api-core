import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$users {
    
                
            updateAvatar(): TRequestExecutors<
        { status: boolean; data: undefined }
    >;
        updateAvatar<
        Method extends "get",
        QueryShape extends {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
        ParamsShape extends {
} & { [K: string]: string }
,
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
            updateAvatar<
        Method extends "delete",
        QueryShape extends {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
        ParamsShape extends {
} & { [K: string]: string }
,
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
            updateAvatar<
        Method extends "put",
        QueryShape extends {
		name?: string;
		alt?: string;
		contentType: string;
		contentLength: number;
} & { [K: string]: any }
,
        ParamsShape extends {
} & { [K: string]: string }
,
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            setFcmToken<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		token: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            deleteFcmToken<
        Method extends "delete",
        QueryShape extends {
		token: string;
},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            updateEmail<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		email: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		type: string;
		value: string;
		verified: boolean;
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
}
    , BodyShape>;
        
                
            update<
        Method extends "patch",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		fname?: string;
		mname?: string;
		lname?: string;
		gender: string;
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		username?: string;
		password?: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates?: Array<ObjectId>;
		deletionAt: Date | null;
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
}
    , BodyShape>;
        
                
            me(): TRequestExecutors<
        {
		status: boolean;
		data: {
		user: {
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
};
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
}
    >;
        me<
        Method extends "get",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		user: {
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
};
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
}
    , BodyShape>;
        
                
            updatePassword<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		method: string;
		token: string;
		code: number;
		password: string;
		hashedPassword: any;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            updatePhone<
        Method extends "put",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		phone: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		type: string;
		value: string;
		verified: boolean;
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
}
    , BodyShape>;
        
                
            verify<
        Method extends "post",
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		method: string;
		token: string;
		code: number;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            delete<
        Method extends "delete",
        QueryShape extends {
		deletionTimeoutMs?: number;
},
        ParamsShape extends {},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            updateRole<
        Method extends "patch",
        QueryShape extends {},
        ParamsShape extends {
		id?: string;
},
        BodyShape extends {
		role: string;
},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        
                
            get(): TRequestExecutors<
        {
		status: boolean;
		data: {
		totalCount?: number;
		users: Array<{
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
}>;
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
}
    >;
        get<
        Method extends "get",
        QueryShape extends {
		search?: string;
		range?: Array<{} | undefined>;
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
        ParamsShape extends {
		id?: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params?: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		totalCount?: number;
		users: Array<{
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
}>;
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
}
    , BodyShape>;
        
                
            create<
        Method extends "post",
        QueryShape extends {
		reference: any;
},
        ParamsShape extends {
		oauthAppId: string;
		oauthApp: any;
},
        BodyShape extends {
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
		dob?: Date;
		locale?: string;
		country?: string;
		state?: string;
		city?: string;
		address_1?: string;
		address_2?: string;
		postalCode?: string;
},
    >(data: {
        method?: Method;
        query: QueryShape;
        params: ParamsShape;
        body: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		user: {
		username: string;
		password: string;
		avatar: /*(optional)*/{
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
		gender: string;
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
		requiresMfa?: boolean;
		isBlocked?: boolean;
		collaborates: Array<ObjectId>;
		deletionAt: Date | null;
};
		account: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		createdBy: ObjectId;
		createdFor: ObjectId;
		logo: /*(optional)*/{
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
		metrics: /*(optional)*/{
		handledInMs?: number;
		respondInMs?: number;
} & { [K: string]: any }
;
		metadata?: /*(optional)*/{
} & { [K: string]: any }
;
}
    , BodyShape>;
        
                
            toggleBlocked<
        Method extends "patch",
        QueryShape extends {},
        ParamsShape extends {
		id: string;
		isBlocked: boolean;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        { status: boolean; data: undefined }
    , BodyShape>;
        }

export const usersModule = (sdk: any): IController$users => ({
    
    updateAvatar(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateAvatar");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/avatar/sign/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    setFcmToken(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "setFcmToken");

            const res = await sdk.axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/users/fcm/token/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    deleteFcmToken(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "deleteFcmToken");

            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/users/fcm/token/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    updateEmail(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateEmail");

            const res = await sdk.axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/users/email/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    update(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "update");

            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/users/me/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    me(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "me");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/me/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    updatePassword(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updatePassword");

            const res = await sdk.axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/users/password/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    updatePhone(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updatePhone");

            const res = await sdk.axios.request({
                method: data?.method ?? "put" ?? "get",
                url: `/api/users/phone/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    verify(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "verify");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/users/verify/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "delete");

            const res = await sdk.axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/users/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    updateRole(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "updateRole");

            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/users/role/:id/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "get");

            const res = await sdk.axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/users/:id?/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "create");

            const res = await sdk.axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/users/:oauthAppId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    toggleBlocked(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk.axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("users", "toggleBlocked");

            const res = await sdk.axios.request({
                method: data?.method ?? "patch" ?? "get",
                url: `/api/users/toggle/blocked/:id/:isBlocked/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});