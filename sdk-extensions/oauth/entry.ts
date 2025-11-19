import { EpicSDK } from "epic-api-sdk";

import { encode as base64encode } from "npm:base64-arraybuffer";
import { sha256 } from "npm:js-sha256";
import { SecurityGuard } from "./lib/securityGuard.ts";

export type TAuthToken<T extends "oauth_refresh_token" | "oauth_access_token"> =
  {
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

export class oauthEntry {
  static auth?: TAuthorization;
  static guard?: SecurityGuard;
  static selectedAccount?: string;

  protected static _authInterceptorAdded = false;
  protected static _refreshRequest?: Promise<TAuthorization>;

  protected static generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  protected static generateCodeChallenge() {
    const verifier = this.generateRandomString(128);

    return {
      verifier,
      method: "sha-256",
      challenge: base64encode(sha256.arrayBuffer(verifier))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, ""),
    };
  }

  protected static async onLogin() {
    if (!this._authInterceptorAdded) {
      EpicSDK._axios!.interceptors.request.use(
        async (config) => {
          if (!config.headers["Authorization"] && this.auth) {
            const timeInSeconds = Date.now() / 1000;

            if (
              this.auth.access.expiresAtSeconds <= timeInSeconds
            ) {
              if (
                !this.auth.refresh ||
                this.auth.refresh.expiresAtSeconds <=
                  timeInSeconds
              ) {
                throw new Error("Access token expired!");
              }

              await this.refreshAccessToken(
                this.auth.refresh.token,
              );

              //! this._refreshRequest is used to stop bubbling do not remove it!
              setTimeout(() => {
                delete this._refreshRequest;
              }, 1000);
            }

            config.headers["Authorization"] =
              `Bearer ${this.auth.access.token}`;

            config.headers["X-Api-Version"] = EpicSDK._apiVersion;

            if (this.selectedAccount) {
              config.headers["X-Account-ID"] = this.selectedAccount;
            }
          }

          return config;
        },
      );

      this._authInterceptorAdded = true;
    }

    await this.registerPermissions();
  }

  protected static async registerPermissions() {
    const { scopePipeline } = await EpicSDK.oauthPolicies.me().data;

    this.guard = new SecurityGuard().load({
      scopePipeline: scopePipeline.map(($) => new Set($)),
    });

    EpicSDK.isPermitted = (scope, permission) =>
      this.guard!.isPermitted(
        (typeof scope === "function" ? scope.__permission : scope) ?? "",
        permission,
      );
  }

  static oauth2Login(
    appId: string,
    opts: TOauth2LoginOptions,
  ) {
    const { verifier, method, challenge } = this.generateCodeChallenge();

    const url = new URL(
      `/oauth/login
            ?appId=${appId}
            &codeChallengeMethod=${method}
            &codeChallenge=${challenge}
            &callbackURL=${opts.callbackUrl}
            &state=${btoa(JSON.stringify(opts.state))}
            &theme=${opts.theme ?? "system"}
            &lng=${opts.lng ?? "en"}
            ${opts.username ? `&username=${opts.username}` : ""}`.replace(
        /\s*/g,
        "",
      ),
      EpicSDK._options?.axiosConfig?.baseURL,
    ).toString();

    return {
      verifier,
      url,
    };
  }

  static async login(
    appId: string,
    opts: {
      onRedirect: (url: string) => void;
      code?: string;
    } & TOauth2LoginOptions,
  ) {
    const authorization = await EpicSDK.getCache<TAuthorization>(
      "authorization",
    );

    if (authorization) {
      this.auth = authorization.value;

      await this.onLogin();

      return authorization.value;
    }

    exchangeCode: if (typeof opts?.code === "string") {
      const verifier = await EpicSDK.getCache<string>("verifier");

      if (!verifier) break exchangeCode;

      const authorization = await this.fetchAccessToken(
        opts.code,
        verifier.value,
      );

      await EpicSDK.setCache("authorization", authorization);

      return authorization;
    }

    const { verifier, url } = this.oauth2Login(appId, opts);

    await EpicSDK.setCache("verifier", verifier);

    opts.onRedirect(url);
  }

  static async fetchAccessToken(code: string, verifier: string, opts?: {
    deviceToken?: string;
    geoPoint?: {
      coordinates: [number, number];
    };
  }) {
    this.auth = await EpicSDK.oauth.exchangeCode({
      body: {
        code,
        codeVerifier: verifier,
        fcmDeviceToken: opts?.deviceToken,
        geoPoint: opts?.geoPoint,
      },
    }).data as TAuthorization;

    await this.onLogin();

    return this.auth;
  }

  static async refreshAccessToken(refreshToken: string) {
    //! this._refreshRequest is used to stop bubbling do not remove it!
    this.auth = await (this._refreshRequest ??= EpicSDK.oauth.refresh({
      body: {
        refreshToken,
        refreshTokenPayload: undefined,
      },
    }).data as Promise<TAuthorization>);
  }

  static async logout(allDevices = false, fcmDeviceToken?: string) {
    await EpicSDK.delCache("authorization");
    await EpicSDK.delCache("verifier");

    await EpicSDK.oauth.logout({ query: { allDevices, fcmDeviceToken } })
      .raw;
  }
}
