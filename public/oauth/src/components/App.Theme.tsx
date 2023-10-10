import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

export const AppTheme = () => {
  const { app, loading } = useOauthApp();
  const ThemeMode = useThemeMode();

  const DefaultPrimaryColor = "#9e9e9e";
  const DefaultSecondaryColor = "#607d8b";
  const DefaultRoundness = 10;

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

  return (
    <ThemeProvider
      theme={createTheme({
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
      {loading ? <LoadingFormPage /> : !app ? <NoAppPage /> : <AppRoutes />}
    </ThemeProvider>
  );
};
