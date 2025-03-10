import type { ObjectId, TRequestOptions, TRequestExecutors } from "../types";

export interface IController$oauthApps {
    
                
            getDefault(): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        getDefault<
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
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        QueryShape extends {},
        ParamsShape extends {},
        BodyShape extends {
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        
                
            list(): TRequestExecutors<
        {
		status: boolean;
		data: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
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
        list<
        Method extends "get",
        QueryShape extends {
		limit?: number;
		offset?: number;
},
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
		data: Array<{
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
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
        
                
            getDetails(): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        getDetails<
        Method extends "get",
        QueryShape extends {},
        ParamsShape extends {
		appId: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        
                
            get(): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        QueryShape extends {},
        ParamsShape extends {
		appId: string;
},
        BodyShape extends {},
    >(data: {
        method?: Method;
        query?: QueryShape;
        params: ParamsShape;
        body?: BodyShape;
    } & TRequestOptions): TRequestExecutors<
        {
		status: boolean;
		data: {
		_id?: ObjectId;
		createdAt?: Date;
		updatedAt?: Date;
		account?: ObjectId;
		createdBy?: ObjectId;
		name: string;
		description?: string;
		enabled?: boolean;
		consent: {
		availableSignups?: number;
		passkeyEnabled?: boolean;
		availableCountryCodes?: Array<string>;
		requiredIdentificationMethods?: Array<string>;
		logo: /*(optional)*/{
		_id?: ObjectId;
		createdBy?: ObjectId;
		name?: string;
		url: string;
		mimeType?: string;
		sizeInBytes?: number;
		alt?: string;
};
		primaryColor: string;
		primaryColorDark?: string;
		secondaryColor: string;
		secondaryColorDark?: string;
		styling?: /*(optional)*/{
		roundness?: number;
};
		passwordPolicy?: /*(optional)*/{
		strength?: number;
		minLength?: number;
		maxLength?: number;
};
		allowedCallbackURLs: Array<string>;
		homepageURL: string;
		privacyPolicyURL?: string;
		termsAndConditionsURL?: string;
		supportURL?: string;
};
		integrations?: Array<{
		id: string;
		enabled?: boolean;
		publicKey?: string;
		secretKey?: string;
		props?: /*(optional)*/{
} & { [K: string]: string }
;
}>;
		metadata?: /*(optional)*/{
} & { [K: string]: string }
;
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
        
                
            delete<
        Method extends "delete",
        QueryShape extends {},
        ParamsShape extends {
		appId?: {
};
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

export const oauthAppsModule = (sdk: any): IController$oauthApps => ({
    
    getDefault(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "getDefault");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/default/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    create(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "create");

            const res = await sdk._axios.request({
                method: data?.method ?? "post" ?? "get",
                url: `/api/oauth/apps/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    list(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "list");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    getDetails(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "getDetails");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/details/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    get(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "get");

            const res = await sdk._axios.request({
                method: data?.method ?? "get" ?? "get",
                url: `/api/oauth/apps/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
    delete(data?: any) {
        return sdk.resolveAxiosResponse(async () => {
            if (!sdk._axios) throw new Error("Axios not initialized!");

            sdk.checkPermission("oauthApps", "delete");

            const res = await sdk._axios.request({
                method: data?.method ?? "delete" ?? "get",
                url: `/api/oauth/apps/:appId/${Object.values(data?.params ?? {}).join("/")}`,
                params: data?.query,
                data: data?.body,
                ...data?.axiosConfig,
            });

            return res;
        });
    },
    
});