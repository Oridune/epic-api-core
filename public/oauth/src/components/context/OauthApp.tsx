import React from "react";
import axios from "axios";

export interface IOauthConsent {
  requiredIdentificationMethods: Array<"email" | "phone">;
  logo?: {
    url: string;
  };
  primaryColor: string;
  secondaryColor: string;
  styling?: {
    roundness?: number;
  };
  allowedCallbackURLs: string[];
  callbackURL: string;
  homepageURL: string;
  privacyPolicyURL?: string;
  termsAndConditionsURL?: string;
  supportURL?: string;
}

export interface IOauthApp {
  _id: string;
  name: string;
  description: string;
  consent: IOauthConsent;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type TSetOauthApp = (appId?: string) => void;

export const OauthAppContext = React.createContext<{
  app: IOauthApp | null;
  loading: boolean;
}>({ app: null, loading: false });

export const useOauthApp = () => React.useContext(OauthAppContext);

export interface IOauthAppProviderProps {
  children: React.ReactNode;
}

export const FetchOauthApp = async (appId: string) => {
  try {
    const Response = await axios.get(`/api/oauth/apps/${appId}`, {
      baseURL: import.meta.env.VITE_API_HOST,
      headers: {
        "X-Api-Version": import.meta.env.VITE_API_VERSION,
      },
    });

    if (Response.data.status) return Response.data.data as IOauthApp;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const OauthAppProvider: React.FC<IOauthAppProviderProps> = ({
  children,
}) => {
  const QueryAppID = new URLSearchParams(window.location.search).get("appId");
  const AppID = QueryAppID
    ? QueryAppID
    : import.meta.env.DEV
    ? "default"
    : null;

  const [Loading, setLoading] = React.useState(!!AppID);
  const [App, setApp] = React.useState<IOauthApp | null>(null);

  React.useEffect(() => {
    if (AppID)
      (async () => {
        setApp(await FetchOauthApp(AppID));
        setLoading(false);
      })();
  }, [AppID]);

  return (
    <OauthAppContext.Provider
      value={{
        app: App,
        loading: Loading,
      }}
    >
      {children}
    </OauthAppContext.Provider>
  );
};
