import { Typography, Icon } from "@mui/material";
import { Box } from "@mui/system";

export interface IErrorPageProps {
  code?: number;
  message: string;
}

export const ErrorPage: React.FC<IErrorPageProps> = ({ code, message }) => (
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
      {code && (
        <Typography component="h1" variant="h5">
          <strong>{code}</strong>
        </Typography>
      )}

      <Typography variant="body2">
        {message || "Unknown error occured!"}
      </Typography>
    </Box>
  </Box>
);
