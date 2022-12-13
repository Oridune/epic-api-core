import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import { SidebarPartial } from "./Dashboard/partials/Sidebar";
import { HeaderPartial } from "./Dashboard/partials/Header";

import { OverviewPage } from "./Dashboard/pages/Overview";

export const DashboardPage = () => {
  return (
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
          <HeaderPartial />
          <OverviewPage />
        </Grid>
      </Grid>
    </Box>
  );
};
