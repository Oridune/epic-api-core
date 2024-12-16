import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import { ErrorBoundary } from "./misc/ErrorBoundary";

import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { ForgotPage } from "./pages/Forgot";
import { ContactsPage } from "./pages/Contacts";
import { PasskeyPage } from "./pages/Passkey";
import { NotFoundPage } from "./pages/NotFound";

export const AppRoutes = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        [
          {
            path: "/",
            element: <Navigate to={`/login/${window.location.search}`} />,
            ErrorBoundary,
          },
          {
            path: "/login",
            element: <LoginPage />,
            ErrorBoundary,
          },
          {
            path: "/signup",
            element: <SignupPage />,
            ErrorBoundary,
          },
          {
            path: "/forgot",
            element: <ForgotPage />,
            ErrorBoundary,
          },
          {
            path: "/contacts/:username",
            element: <ContactsPage />,
            ErrorBoundary,
          },
          {
            path: "/passkey/setup/",
            element: <PasskeyPage />,
            ErrorBoundary,
          },
          {
            path: "*",
            element: <NotFoundPage />,
            ErrorBoundary,
          },
        ],
        { basename: import.meta.env.BASE_URL.replace(/\/$/, "") }
      )}
    />
  );
};
