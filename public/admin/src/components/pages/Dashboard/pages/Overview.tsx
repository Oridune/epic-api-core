import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

import { HeaderPartial } from "../partials/Header";

export const OverviewPage = () => {
  const Navigate = useNavigate();

  return (
    <>
      <HeaderPartial label="Overview" />
      <Box sx={{ width: "100%", height: "calc(100vh - 60px)" }}>
        <Box sx={{ paddingX: 2, maxWidth: "72rem", marginX: "auto" }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Home
            </Link>
            <Typography color="text.primary">Overview</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </>
  );
};
