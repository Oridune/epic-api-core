import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Credits } from "../misc/Credits";

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "95vh",
      }}
    >
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box width="100%">
          <Credits />
        </Box>
        <Box
          width="100%"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            <strong>404</strong>
          </Typography>
          <Divider sx={{ marginX: 2 }} orientation="vertical" flexItem />
          <Typography color="text.secondary">
            {t("This page could not be found!")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
