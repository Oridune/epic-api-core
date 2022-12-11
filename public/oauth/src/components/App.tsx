import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CheckedCircle } from "./icons/CheckedCircle";
import { Circle } from "./icons/Circle";

import { LoginPage } from "./pages/Login";
import { ErrorPage } from "./pages/Error";

export const App = () => {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: {
            main: "#e85d04",
          },
          secondary: {
            main: "#faa307",
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
        },
      })}
    >
      <RouterProvider
        router={createBrowserRouter(
          [
            {
              path: "/",
              element: <Navigate to="/login" />,
            },
            {
              path: "/login",
              element: <LoginPage />,
            },
            {
              path: "/login/:appId",
              element: <LoginPage />,
            },
            {
              path: "*",
              element: <ErrorPage />,
            },
          ],
          { basename: import.meta.env.BASE_URL }
        )}
      />
    </ThemeProvider>
  );
};
