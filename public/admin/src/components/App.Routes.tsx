import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DashboardPage } from "./pages/Dashboard";
import { OverviewPage } from "./pages/Dashboard/pages/Overview";
import { PluginsPage } from "./pages/Dashboard/pages/Plugins";
import { ErrorPage as SubErrorPage } from "./pages/Dashboard/pages/Error";
import { ErrorPage } from "./pages/Error";

export const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>
        <Route path="/" element={<DashboardPage />}>
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="*" element={<SubErrorPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
