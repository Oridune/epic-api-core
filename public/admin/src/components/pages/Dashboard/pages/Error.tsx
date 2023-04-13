import { Typography, Icon } from "@mui/material";
import { Box } from "@mui/system";

export const ErrorPage = () => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "90vh",
    }}
  >
    <Icon fontSize="large">sd_card_alert</Icon>
    <Box>
      <Typography component="h1" variant="h5">
        <strong>404</strong>
      </Typography>
      <Typography variant="body2">This page could not be found!</Typography>
    </Box>
  </Box>
);
