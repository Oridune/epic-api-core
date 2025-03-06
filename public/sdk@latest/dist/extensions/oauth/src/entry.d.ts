export type TAuthToken<T extends "oauth_refresh_token" | "oauth_access_token"> = {
    issuer: string;
    type: T;
    token: string;
    expiresAtSeconds: number;
};
export type TAuthorization = {
    refresh: TAuthToken<"oauth_refresh_token">;
    access: TAuthToken<"oauth_access_token">;
};
export declare class oauthEntry {
    static auth?: TAuthorization;
    protected static _refreshRequest?: Promise<TAuthorization>;
    protected static generateRandomString(length: number): string;
    protected static generateCodeChallenge(): {
        verifier: string;
        method: string;
        challenge: string;
    };
    static oauth2Login(appId: string, opts: {
        callbackUrl: string;
        theme?: "dark" | "light" | "system";
        lng?: string;
        username?: string;
        state?: Record<string, any>;
    }): {
        verifier: string;
        url: string;
    };
    static getAccessToken(code: string, verifier: string, opts: {
        deviceToken?: string;
    }): Promise<void>;
    static refreshAccessToken(refreshToken: string): Promise<void>;
}
