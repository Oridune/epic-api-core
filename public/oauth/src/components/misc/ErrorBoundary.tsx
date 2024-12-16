import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useRouteError } from "react-router";

interface ErrorBoundaryProps {}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = () => {
  const [ShowError, setShowError] = React.useState(false);

  const error: any = useRouteError();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div>
        <Typography component="h1" variant="h2" sx={{ mb: "30px" }}>
          {":("}
        </Typography>
        <Typography component="h3" variant="h5">
          {error.status ?? "Error occured"}
        </Typography>
        <Typography color="text.secondary">
          {error.data ?? error.message}
        </Typography>

        {ShowError && (
          <Box
            sx={{
              mt: "10px",
              padding: "10px",
              maxHeight: "400px",
              overflowY: "auto",
              background: grey["100"],
            }}
          >
            <Typography>{error.stack}</Typography>
          </Box>
        )}

        {error.stack && (
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={() => {
              setShowError(!ShowError);
            }}
            sx={{ my: 2 }}
          >
            {ShowError ? "Hide details" : "View details"}
          </Button>
        )}
      </div>
    </div>
  );
};
