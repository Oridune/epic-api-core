import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ReactGA4 from "react-ga4";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useThemeMode } from "./hooks/themeMode";

import { CheckedCircle } from "./icons/CheckedCircle";
import { Circle } from "./icons/Circle";

import { AppRoutes } from "./App.Routes";
import { useOauthApp } from "./context/OauthApp";
import { NoAppPage } from "./pages/NoApp";
import { LoadingFormPage } from "./pages/LoadingForm";

import Logo from "../assets/logo.png";

export const AppTheme = () => {
  const [locizeInit, setLocizeInit] = React.useState(false);
  const { app, loading, integrations } = useOauthApp();

  const ThemeMode = useThemeMode();
  const { i18n } = useTranslation();

  // Theme
  const DefaultPrimaryColor = "#9e9e9e";
  const DefaultSecondaryColor = "#607d8b";
  const DefaultRoundness = 10;
  const ArabicFontFamily = "'Noto Sans Arabic', sans-serif";

  const FontFamily = i18n.language === "ar" ? ArabicFontFamily : undefined;
  const PrimaryColor =
    (ThemeMode === "dark"
      ? app?.consent.primaryColorDark
      : app?.consent.primaryColor) ??
    app?.consent.primaryColor ??
    DefaultPrimaryColor;
  const SecondaryColor =
    (ThemeMode === "dark"
      ? app?.consent.secondaryColorDark
      : app?.consent.secondaryColor) ??
    app?.consent.secondaryColor ??
    DefaultSecondaryColor;
  const Roundness = app?.consent.styling?.roundness ?? DefaultRoundness;

  React.useEffect(() => {
    if (integrations.i18nLocize?.publicKey && !locizeInit) {
      setLocizeInit(true);

      (async () => {
        const locizeBackend = await import("i18next-locize-backend");

        await i18n.use(locizeBackend.default).init({
          backend: {
            projectId: integrations.i18nLocize?.props?.projectId,
            apiKey: integrations.i18nLocize?.publicKey,
            // referenceLng: i18n.options.fallbackLng,
          },
          ...i18n.options,
          resources: undefined,
          lng: i18n.language,
          saveMissing: true,
        });
      })();
    }
  }, [integrations.i18nLocize]);

  React.useEffect(() => {
    if (integrations.googleAnalytics4?.publicKey) {
      ReactGA4.initialize(integrations.googleAnalytics4?.publicKey);
    }
  }, [integrations.googleAnalytics4]);

  const MainContent = loading ? (
    <LoadingFormPage />
  ) : !app ? (
    <NoAppPage />
  ) : (
    <>
      <Helmet>
        <link
          rel="shortcut icon"
          href={app.consent.logo?.url ?? Logo}
          type="image/x-icon"
        />
      </Helmet>
      <AppRoutes />
    </>
  );

  return (
    <ThemeProvider
      theme={createTheme({
        typography: {
          fontFamily: FontFamily,
        },
        palette: {
          mode: ThemeMode,
          primary: {
            main: PrimaryColor,
          },
          secondary: {
            main: SecondaryColor,
          },
        },
        components: {
          MuiSvgIcon: {
            defaultProps: {
              fontSize: "small",
            },
          },
          MuiInputLabel: {
            defaultProps: {
              size: "small",
            },
          },
          MuiOutlinedInput: {
            defaultProps: {
              size: "small",
              margin: "dense",
            },
            styleOverrides: {
              root: {
                borderRadius: Roundness,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: Roundness,
              },
            },
          },
          MuiCheckbox: {
            defaultProps: {
              checkedIcon: <CheckedCircle />,
              icon: <Circle />,
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                textDecorationLine: "none",
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: Roundness,
              },
            },
          },
        },
      })}
    >
      <CssBaseline />
      {integrations.reCaptchaV3?.publicKey ? (
        <GoogleReCaptchaProvider
          reCaptchaKey={integrations.reCaptchaV3.publicKey}
          language={i18n.language}
          useRecaptchaNet={[undefined, "true", "1"].includes(
            integrations.reCaptchaV3.props?.useRecaptchaNet
          )}
          useEnterprise={[undefined, "true", "1"].includes(
            integrations.reCaptchaV3.props?.useEnterprise
          )}
          container={{ parameters: { theme: ThemeMode } }}
        >
          {MainContent}
        </GoogleReCaptchaProvider>
      ) : (
        MainContent
      )}
    </ThemeProvider>
  );
};
