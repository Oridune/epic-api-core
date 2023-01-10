import React from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

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

export const useAuth = () => {
  const TokensKey = "AUTH_TOKENS";

  const [Params] = useSearchParams();

  const OauthCode = Params.get("code");

  const [Loading, setLoading] = React.useState(true);
  const [Tokens, setTokens] = React.useState<IOauthTokens | null>(null);

  React.useEffect(() => {
    (async () => {
      if (OauthCode) {
        try {
          const Response = await axios.post(
            "/api/oauth/access/",
            { code: OauthCode },
            { baseURL: import.meta.env.VITE_API_HOST }
          );

          if (Response.data.status) SetTokens(Response.data.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        const RawTokens = localStorage.getItem(TokensKey);
        if (RawTokens)
          try {
            setTokens(JSON.parse(RawTokens));
          } catch {
            localStorage.removeItem(TokensKey);
          }
      }

      setLoading(false);
    })();
  }, [OauthCode]);

  const SetTokens = (tokens: IOauthTokens) => {
    localStorage.setItem(TokensKey, JSON.stringify(tokens));
    setTokens(tokens);
  };

  return [Loading, Tokens, SetTokens] as const;
};
