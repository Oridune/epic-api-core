import React from "react";
import axios from "../utils/axios";

export interface IOauthConsent {
  passkeyEnabled?: boolean;
  availableCountryCodes?: string[];
  requiredIdentificationMethods: Array<"email" | "phone">;
  logo?: {
    url: string;
  };
  primaryColor: string;
  primaryColorDark?: string;
  secondaryColor: string;
  secondaryColorDark?: string;
  styling?: {
    roundness?: number;
  };
  allowedCallbackURLs: string[];
  callbackURL: string;
  homepageURL: string;
  privacyPolicyURL?: string;
  termsAndConditionsURL?: string;
  supportURL?: string;
  passwordPolicy?: {
    strength?: 0 | 1 | 2;
    minLength?: number;
    maxLength?: number;
  };
}

export const ExpectedIntegrationsMapping = {
  "re-captcha-v3": "reCaptchaV3",
  "google-analytics-4": "googleAnalytics4",
  "i18n-locize": "i18nLocize",
} as const;

export interface IOauthIntegration {
  id: keyof typeof ExpectedIntegrationsMapping;
  enabled: boolean;
  publicKey?: string;
  props?: Record<string, string>;
}

export interface IOauthApp {
  _id: string;
  name: string;
  description: string;
  consent: IOauthConsent;
  integrations?: Array<IOauthIntegration>;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type TSetOauthApp = (appId?: string) => void;

export const OauthAppContext = React.createContext<{
  app: IOauthApp | null;
  loading: boolean;
  integrations: {
    googleAnalytics4?: IOauthIntegration;
    reCaptchaV3?: IOauthIntegration;
    i18nLocize?: IOauthIntegration;
  };
}>({ app: null, loading: false, integrations: {} });

export const useOauthApp = () => React.useContext(OauthAppContext);

export interface IOauthAppProviderProps {
  children: React.ReactNode;
}

export const FetchOauthApp = async (appId: string) => {
  try {
    const Response = await axios.get(`/api/oauth/apps/${appId}`);

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
        integrations: Object.entries(ExpectedIntegrationsMapping).reduce(
          (obj, [id, key]) => ({
            ...obj,
            [key]: App?.integrations?.find((i) => i.enabled && i.id === id),
          }),
          {}
        ),
      }}
    >
      {children}
    </OauthAppContext.Provider>
  );
};
