import React from "react";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { encode as base64encode } from "base64-arraybuffer";
import randomString from "randomized-string";

import { useAuth } from "../context/auth";

import { SidebarPartial } from "./Dashboard/partials/Sidebar";
import { LoadingPage } from "./Dashboard/pages/Loading";
import { ErrorPage } from "./Error";

export const generateCodeChallenge = async (verifier: string) => {
  return {
    verifier,
    challenge: base64encode(
      await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier)
      )
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, ""),
  };
};

export const DashboardPage = () => {
  const { isLoading, isError, error, getTokens } = useAuth();

  React.useEffect(() => {
    Notification.requestPermission();
  }, []);

  if (isLoading || (!isError && !getTokens() && !import.meta.env.DEV)) {
    if (!isLoading) {
      generateCodeChallenge(randomString.generate(128)).then(
        ({ verifier, challenge }) => {
          localStorage.setItem("codeChallengeVerifier", verifier);
          window.location.href = `/oauth/login/?appId=default&codeChallengeMethod=sha256&codeChallenge=${challenge}&callbackURL=${
            import.meta.env.BASE_URL
          }`;
        }
      );
    }

    return <LoadingPage />;
  }

  if (isError)
    return <ErrorPage message={error?.message || "Unknown error occured!"} />;

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid
          item
          md={2}
          sx={{
            "@media (max-width: 900px)": {
              display: "none",
            },
          }}
        >
          <SidebarPartial />
        </Grid>
        <Grid item xs={12} md={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};
