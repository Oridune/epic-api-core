import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const NoAppPage = () => (
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
        <strong>Consent Error</strong>
      </Typography>
      <Divider sx={{ marginX: 2 }} orientation="vertical" flexItem />
      <Typography>
        We've encountered an issue while fetching the consent information!
      </Typography>
    </Box>
  </Box>
);
