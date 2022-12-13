import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CheckedCircle } from "./icons/CheckedCircle";
import { Circle } from "./icons/Circle";

import { DashboardPage } from "./pages/Dashboard";
import { ErrorPage } from "./pages/Error";
import { blueGrey } from "@mui/material/colors";

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
          MuiIcon: {
            defaultProps: {
              baseClassName: "material-symbols-rounded",
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
          MuiListItemText: {
            defaultProps: {
              primaryTypographyProps: {
                color: "#6d6d6d",
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: "35px",
                color: "#6d6d6d",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
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
              element: <DashboardPage />,
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
