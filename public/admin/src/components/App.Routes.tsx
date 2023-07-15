import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { OAuthProvider } from "./context/auth";

import { DashboardPage } from "./pages/Dashboard";
import { OverviewPage } from "./pages/Dashboard/pages/Overview";
import { PluginsPage } from "./pages/Dashboard/pages/Plugins";
import { AllAppsOAuthPage } from "./pages/Dashboard/pages/OAuth/AllApps";
import { NewAppOAuthPage } from "./pages/Dashboard/pages/OAuth/NewApp";
import { GeneralSettingsPage } from "./pages/Dashboard/pages/Settings/General";
import { ProfileSettingsPage } from "./pages/Dashboard/pages/Settings/Profile";
import { ErrorPage as SubErrorPage } from "./pages/Dashboard/pages/Error";
import { ErrorPage } from "./pages/Error";

export const AppRoutes = () => {
  return (
    <OAuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route path="/" element={<DashboardPage />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/oauth" element={<Navigate to="/oauth/apps" />} />
            <Route path="/oauth/all/apps" element={<AllAppsOAuthPage />} />
            <Route
              path="/oauth/apps"
              element={<Navigate to="/oauth/all/apps" />}
            />
            <Route path="/oauth/apps/new" element={<NewAppOAuthPage />} />
            <Route path="/plugins" element={<PluginsPage />} />
            <Route
              path="/settings"
              element={<Navigate to="/settings/general" />}
            />
            <Route path="/settings/general" element={<GeneralSettingsPage />} />
            <Route path="/settings/profile" element={<ProfileSettingsPage />} />
            <Route
              path="*"
              element={
                <SubErrorPage code={404} message="Requested page not found!" />
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <ErrorPage code={404} message="Requested page not found!" />
            }
          />
        </Routes>
      </BrowserRouter>
    </OAuthProvider>
  );
};
