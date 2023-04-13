import React from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  Icon,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey, red } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { TGetTokens, useAuth } from "../../../../context/auth";
import { HeaderPartial } from "../../partials/Header";

import { CustomDialog, ICustomDialogRef } from "../../../../utils/Dialog";

export const UpdateCore =
  <D extends any>(getTokens: TGetTokens) =>
  async () => {
    const Response = await axios.patch<{
      status: boolean;
      data: D;
      messages: { message: string }[];
    }>(
      "/api/admin/core/",
      {},
      {
        baseURL: import.meta.env.VITE_API_HOST,
        validateStatus: (status) => status < 500,
        headers: {
          Authorization: `Bearer ${
            (
              await getTokens()?.resolveTokens()
            )?.access.token
          }`,
        },
      }
    );

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );

    return Response.data;
  };

export const GeneralSettingsPage = () => {
  const Navigate = useNavigate();

  const { getTokens } = useAuth();

  const [UpdateCoreLoading, setUpdateCoreLoading] = React.useState(false);

  const UpdateCoreDialogRef = React.createRef<ICustomDialogRef>();

  return (
    <>
      <HeaderPartial label="General" />
      <Box sx={{ width: "100%", height: "calc(100vh - 60px)" }}>
        <Box
          sx={{
            paddingX: 2,
            maxWidth: "72rem",
            height: "100%",
            marginX: "auto",
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Home
            </Link>
            <Link
              color="inherit"
              href="/settings"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Settings
            </Link>
            <Typography color="text.primary">General</Typography>
          </Breadcrumbs>
          <Box
            sx={{ marginY: 2, height: "calc(100% - 50px)", overflow: "auto" }}
          >
            <Grid
              container
              spacing={1}
              sx={{
                borderBottom: 1,
                borderColor: grey["300"],
                paddingY: 2,
              }}
            >
              <Grid item md={4}>
                <Typography variant="subtitle2" component="div">
                  Interface Theme
                </Typography>
                <Typography variant="caption" component="div" color="grey">
                  Select or customize the theme of your UI.
                </Typography>
              </Grid>
              <Grid item md={8}>
                <FormControl>
                  <FormLabel id="system_theme">Theme</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="system_theme"
                    name="system_theme"
                    defaultValue={"system"}
                  >
                    <FormControlLabel
                      value="system"
                      control={<Radio />}
                      label="System Prefered"
                    />
                    <FormControlLabel
                      value="light"
                      control={<Radio />}
                      label="Light"
                    />
                    <FormControlLabel
                      value="dark"
                      control={<Radio />}
                      label="Dark"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              sx={{
                borderBottom: 1,
                borderColor: grey["300"],
                paddingY: 2,
              }}
            >
              <Grid item md={4}>
                <Typography variant="subtitle2" component="div">
                  Update Core
                </Typography>
                <Typography variant="caption" component="div" color="grey">
                  Update application's core. Note: Executing this action can
                  possibly break the application! Please proceed carefully or
                  consult a developer.
                </Typography>
              </Grid>
              <Grid item md={8}>
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={UpdateCoreLoading}
                  onClick={async () => {
                    setUpdateCoreLoading(true);

                    if (
                      await UpdateCoreDialogRef.current?.confirm({
                        title: "Are you sure?",
                        description: `Executing this action can possibly break the application! Please proceed carefully or consult a developer.`,
                      })
                    )
                      await UpdateCore(getTokens)().catch(
                        (error) => new Notification(error.message)
                      );

                    setUpdateCoreLoading(false);
                  }}
                >
                  Update Core
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <CustomDialog id="update-core" ref={UpdateCoreDialogRef} />
    </>
  );
};
