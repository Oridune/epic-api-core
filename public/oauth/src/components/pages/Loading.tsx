import { Box, LinearProgress, Typography } from "@mui/material";

export const LoadingPage = () => (
  <Box sx={{ width: "100%", height: "100vh" }}>
    <LinearProgress />
    <Box
      sx={{
        width: "100%",
        height: "95%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" color="GrayText">
        Loading...
      </Typography>
    </Box>
  </Box>
);
