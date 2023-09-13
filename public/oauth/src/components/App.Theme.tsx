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

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: ThemeMode,
          primary: {
            main: app?.consent.primaryColor ?? "#9e9e9e",
          },
          secondary: {
            main: app?.consent.secondaryColor ?? "#607d8b",
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
                borderRadius: 10,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
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
                borderRadius: 10,
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
