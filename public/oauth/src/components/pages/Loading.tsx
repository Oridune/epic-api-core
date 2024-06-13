import { Box, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const LoadingPage = () => {
  const { t } = useTranslation();

  return (
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
        <Typography variant="body2" color="text.secondary">
          {t("Loading...")}
        </Typography>
      </Box>
    </Box>
  );
};
