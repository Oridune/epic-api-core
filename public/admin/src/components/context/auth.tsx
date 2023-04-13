import React from "react";
import axios, { AxiosError } from "axios";

export interface IOauthToken {
  issuer: string;
  type: string;
  token: string;
  expiresAtSeconds: number;
}

export interface IOauthTokens {
  refresh?: IOauthToken;
  access: IOauthToken;
}

export type TGetTokensResults =
  | (IOauthTokens & {
      refreshTokens: () => Promise<TGetTokensResults>;
      resolveTokens: () => Promise<TGetTokensResults> | TGetTokensResults;
      refreshRequired?: () => Promise<TGetTokensResults>;
    })
  | null;

export type TGetTokens = () => TGetTokensResults;

export type TSetTokens = (tokens: IOauthTokens | null) => void;

export interface IOAuthProvider {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  getTokens: TGetTokens;
  setTokens: TSetTokens;
}

export const OAuthContext = React.createContext<IOAuthProvider>({
  isLoading: false,
  isError: false,
  error: null,
  getTokens: () => null,
  setTokens: () => {},
});

export const OAuthTokensKey = "OAUTH_TOKENS";

export interface IOAuthProviderProps {
  children: React.ReactNode;
}

export const useAuth = () => React.useContext(OAuthContext);

export const OAuthProvider: React.FC<IOAuthProviderProps> = (props) => {
  const { children } = props;

  const [IsLoading, setIsLoading] = React.useState(true);
  const [IsError, setIsError] = React.useState(false);
  const [ErrorObject, setErrorObject] = React.useState<
    Error | AxiosError | null
  >(null);
  const [Tokens, setTokens] = React.useState<IOauthTokens | null>(null);

  const Code = new URLSearchParams(window.location.search).get("code");

  React.useEffect(() => {
    (async () => {
      if (Code)
        try {
          const Response = await axios.post(
            "/api/oauth/exchange/code/",
            {
              code: Code,
              codeVerifier: localStorage.getItem("codeChallengeVerifier") ?? "",
            },
            { baseURL: import.meta.env.VITE_API_HOST }
          );

          if (Response.data.status) SetTokens(Response.data.data);
        } catch (error) {
          setErrorObject(error as Error);
          setIsError(true);
        }

      setIsLoading(false);
    })();
  }, [Code]);

  const isAccessTokenValid = (tokens: IOauthTokens) =>
    tokens.access.expiresAtSeconds > Date.now() / 1000;

  const isRefreshTokenValid = (tokens: IOauthTokens) =>
    (tokens.refresh?.expiresAtSeconds ?? 0) > Date.now() / 1000;

  const refreshTokens = async (tokens: IOauthTokens) => {
    if (!tokens.refresh) throw new Error("No refresh token exists!");

    const Response = await axios.post(
      "/api/oauth/refresh/",
      { refreshToken: tokens.refresh.token },
      { baseURL: import.meta.env.VITE_API_HOST }
    );

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );

    return Response.data.data as IOauthTokens;
  };

  const GetTokens = () => {
    const refresh = async (tokens: IOauthTokens) => {
      try {
        const RefreshedTokens = await refreshTokens(tokens);
        SetTokens(RefreshedTokens);
        const T = {
          ...RefreshedTokens,
          refreshTokens: () => refresh(RefreshedTokens),
          resolveTokens: () => T,
        };

        return T;
      } catch {
        return null;
      }
    };

    if (Tokens && isAccessTokenValid(Tokens)) {
      const T = {
        ...Tokens,
        refreshTokens: () => refresh(Tokens),
        resolveTokens: () => T,
      };

      return T;
    }

    const RawTokens = localStorage.getItem(OAuthTokensKey);

    if (RawTokens)
      try {
        const Tokens: IOauthTokens = JSON.parse(RawTokens);

        if (isAccessTokenValid(Tokens)) {
          setTokens(Tokens);

          const T = {
            ...Tokens,
            refreshTokens: () => refresh(Tokens),
            resolveTokens: () => T,
          };

          return T;
        }

        if (isRefreshTokenValid(Tokens))
          return {
            ...Tokens,
            refreshTokens: () => refresh(Tokens),
            resolveTokens: () => refresh(Tokens),
            refreshRequired: () => refresh(Tokens),
          };
      } catch {}

    localStorage.removeItem(OAuthTokensKey);
    return null;
  };

  const SetTokens = (tokens: IOauthTokens | null) => {
    if (tokens === null) {
      localStorage.removeItem(OAuthTokensKey);
      setTokens(null);
    } else {
      localStorage.setItem(OAuthTokensKey, JSON.stringify(tokens));
      setTokens(tokens);
    }
  };

  return (
    <OAuthContext.Provider
      value={{
        isLoading: IsLoading,
        isError: IsError,
        error: ErrorObject,
        getTokens: GetTokens,
        setTokens: SetTokens,
      }}
    >
      {children}
    </OAuthContext.Provider>
  );
};
