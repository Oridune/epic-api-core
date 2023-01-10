import React from "react";
import axios from "axios";

export interface IOauthAppMetadata {
  consentPrimaryColor: string;
  consentSecondaryColor: string;
}

export interface IOauthApp {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  homepageUrl: string;
  returnUrl: string;
  metadata: IOauthAppMetadata;
  createdAt: string;
  updatedAt: string;
}

export type TSetOauthApp = (appId?: string) => void;

export const OauthAppContext = React.createContext<{
  app: IOauthApp | null;
  loading: boolean;
  setAppId: TSetOauthApp;
}>({ app: null, loading: false, setAppId: () => {} });

export const useOauthApp = () => React.useContext(OauthAppContext);

export interface IOauthAppProviderProps {
  children: React.ReactNode;
}

export const FetchOauthApp = async (appId: string) => {
  try {
    const Response = await axios.get(`/api/oauth/apps/${appId}`, {
      baseURL: import.meta.env.VITE_API_HOST,
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
  const [Loading, setLoading] = React.useState(true);
  const [DefaultApp, setDefaultApp] = React.useState<IOauthApp | null>(null);
  const [App, setApp] = React.useState<IOauthApp | null>(null);

  React.useEffect(() => {
    (async () => {
      setDefaultApp(await FetchOauthApp("default"));
      setLoading(false);
    })();
  }, []);

  return (
    <OauthAppContext.Provider
      value={{
        app: App ?? DefaultApp,
        loading: Loading,
        setAppId: async (appId) => {
          if (appId && appId !== "default") {
            setLoading(true);
            setApp(await FetchOauthApp(appId));
            setLoading(false);
          }
        },
      }}
    >
      {children}
    </OauthAppContext.Provider>
  );
};
