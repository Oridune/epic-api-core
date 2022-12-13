import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const ErrorPage = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "90vh",
    }}
  >
    <Box
      width="100%"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Typography component="h1" variant="h4">
        <strong>404</strong>
      </Typography>
      <Divider sx={{ marginX: 2 }} orientation="vertical" flexItem />
      <Typography>This page could not be found!</Typography>
    </Box>
  </Box>
);
