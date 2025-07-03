import { TRoute$users$me } from "epic-api-sdk/src/modules/users";
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
export type TOauth2LoginOptions = {
    callbackUrl: string;
    theme?: "dark" | "light" | "system";
    lng?: string;
    username?: string;
    state?: Record<string, unknown>;
};
export declare class oauthEntry {
    static auth?: TAuthorization;
    static me?: TRoute$users$me["return"]["data"]["user"];
    static selectedAccount?: string;
    protected static _interceptorAdded: boolean;
    protected static _refreshRequest?: Promise<TAuthorization>;
    protected static generateRandomString(length: number): string;
    protected static generateCodeChallenge(): {
        verifier: string;
        method: string;
        challenge: string;
    };
    static oauth2Login(appId: string, opts: TOauth2LoginOptions): {
        verifier: string;
        url: string;
    };
    static login(appId: string, opts: {
        onRedirect: (url: string) => void;
        code?: string;
    } & TOauth2LoginOptions): Promise<void>;
    static fetchAccessToken(code: string, verifier: string, opts?: {
        deviceToken?: string;
        geoPoint?: {
            coordinates: [number, number];
        };
    }): Promise<void>;
    static refreshAccessToken(refreshToken: string): Promise<void>;
}
