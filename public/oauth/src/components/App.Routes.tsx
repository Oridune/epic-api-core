import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { ForgotPage } from "./pages/Forgot";
import { VerifyPage } from "./pages/Verify";
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
            path: "/signup",
            element: <SignupPage />,
          },
          {
            path: "/forgot",
            element: <ForgotPage />,
          },
          {
            path: "/verify/:username",
            element: <VerifyPage />,
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
