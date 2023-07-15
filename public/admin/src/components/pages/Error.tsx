import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

export interface IErrorPageProps {
  code?: number;
  message: string;
}

export const ErrorPage: React.FC<IErrorPageProps> = ({ code, message }) => (
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
      {code && (
        <>
          <Typography component="h1" variant="h4">
            <strong>{code}</strong>
          </Typography>
          <Divider sx={{ marginX: 2 }} orientation="vertical" flexItem />
        </>
      )}
      <Typography>{message || "Unknown error occured!"}</Typography>
    </Box>
  </Box>
);
