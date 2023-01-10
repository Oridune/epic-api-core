import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useAuth } from "../hooks/auth";

import { SidebarPartial } from "./Dashboard/partials/Sidebar";
import { LoadingPage } from "./Dashboard/pages/Loading";

export const DashboardPage = () => {
  const [Loading, Tokens] = useAuth();

  if (!Loading && !Tokens && !import.meta.env.DEV) {
    window.location.href = "/oauth/login/";
    return <LoadingPage />;
  }

  return Loading ? (
    <LoadingPage />
  ) : (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid
          item
          md={2}
          sx={{
            "@media (max-width: 900px)": {
              display: "none",
            },
          }}
        >
          <SidebarPartial />
        </Grid>
        <Grid item xs={12} md={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};
