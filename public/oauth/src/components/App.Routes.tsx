import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import { LoginPage } from "./pages/Login";
import { ScopesPage } from "./pages/Scopes";
import { SignupPage } from "./pages/Signup";
import { ForgotPage } from "./pages/Forgot";
import { NotFoundPage } from "./pages/NotFound";

export const AppRoutes = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        [
          {
            path: "/",
            element: <Navigate to={`/login/${window.location.search}`} />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/scopes",
            element: <ScopesPage />,
          },
          {
            path: "/signup",
            element: <SignupPage />,
          },
          {
            path: "/forgot",
            element: <ForgotPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
        { basename: import.meta.env.BASE_URL.replace(/\/$/, "") }
      )}
    />
  );
};
