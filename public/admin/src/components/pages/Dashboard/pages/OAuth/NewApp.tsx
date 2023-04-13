import React from "react";
import {
  Box,
  Breadcrumbs,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";

import { ValidatorResolver } from "../../../../utils/validatorResolver";
import { HeaderPartial } from "../../partials/Header";
import { useAuth } from "../../../../context/auth";

export const OAuthAppSchema = e.object({
  name: e.string().length({ min: 2, max: 50 }),
  description: e.optional(e.string().length(300)),
  homepageUrl: e.string().custom((ctx) => new URL(ctx.output).toString()),
  returnUrl: e.string().custom((ctx) => new URL(ctx.output).toString()),
  consentPrimaryColor: e.string().matches(/^(?:[0-9a-fA-F]{3}){1,2}$/),
  consentSecondaryColor: e.string().matches(/^(?:[0-9a-fA-F]{3}){1,2}$/),
});

export const NewAppOAuthPage = () => {
  const Navigate = useNavigate();

  const { getTokens } = useAuth();

  const [Loading, setLoading] = React.useState(false);

  const HandleCreate: SubmitHandler<
    InferOutput<typeof OAuthAppSchema>
  > = async (data) => {
    setLoading(true);

    try {
      const Response = await axios.post(
        "/api/oauth/apps/",
        {
          name: data.name,
          description: data.description,
          homepageUrl: data.homepageUrl,
          returnUrl: data.returnUrl,
          consent: {
            primaryColor: `#${data.consentPrimaryColor}`,
            secondaryColor: `#${data.consentSecondaryColor}`,
          },
        },
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

      if (Response.data.status) Navigate("/oauth/apps/");
      else
        new Notification(
          Response.data.messages?.[0]?.message ?? "Unknown error occured!"
        );
    } catch (error) {
      if (error instanceof AxiosError)
        new Notification(
          error.response?.data.messages?.[0]?.message ??
            error.message ??
            "Unknown error occured!"
        );
    }

    setLoading(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InferOutput<typeof OAuthAppSchema>>({
    resolver: ValidatorResolver(OAuthAppSchema),
  });

  return (
    <>
      <HeaderPartial label="New OAuth App" />
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
              href="/oauth"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              OAuth
            </Link>
            <Link
              color="inherit"
              href="/oauth/apps"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Apps
            </Link>
            <Typography color="text.primary">New</Typography>
          </Breadcrumbs>
          <Box
            sx={{ marginY: 2, height: "calc(100% - 50px)", overflow: "auto" }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(HandleCreate)}
              marginBottom={10}
            >
              <Grid container>
                <Grid item md={3} xs={12}>
                  <Typography variant="subtitle2" component="div" marginTop={1}>
                    Basic Information
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="grey"
                    marginTop={1}
                  >
                    Provide the basic information of your OAuth application.
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box sx={{ marginY: 1 }}>
                    <Grid container rowGap={1} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <FormControl variant="outlined">
                          <InputLabel htmlFor="name">Name</InputLabel>
                          <OutlinedInput
                            id="name"
                            label="Name"
                            type="text"
                            autoComplete="name"
                            {...register("name")}
                            error={!!errors.name?.message}
                          />
                          <FormHelperText error={!!errors.name?.message}>
                            {errors.name?.message ??
                              "Display Name of the OAuth App"}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel htmlFor="description">
                            Description
                          </InputLabel>
                          <OutlinedInput
                            id="description"
                            label="Description"
                            type="text"
                            autoComplete="description"
                            multiline
                            rows={4}
                            {...register("description")}
                            error={!!errors.description?.message}
                          />
                          <FormHelperText error={!!errors.description?.message}>
                            {errors.description?.message ??
                              "Provide a description of your app"}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={3} xs={12}>
                  <Typography variant="subtitle2" component="div" marginTop={1}>
                    Consent Screen
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="grey"
                    marginTop={1}
                  >
                    Configure the OAuth consent screen of your application.
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box sx={{ marginY: 1 }}>
                    <Grid container rowGap={1} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel htmlFor="homepageUrl">
                            Homepage URL
                          </InputLabel>
                          <OutlinedInput
                            id="homepageUrl"
                            label="Homepage URL"
                            type="text"
                            autoComplete="homepageUrl"
                            {...register("homepageUrl")}
                            error={!!errors.homepageUrl?.message}
                          />
                          <FormHelperText error={!!errors.homepageUrl?.message}>
                            {errors.homepageUrl?.message ??
                              "Provide a valid homepage URL of your app. E.g: https://oridune.com"}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel htmlFor="returnUrl">
                            Return URL
                          </InputLabel>
                          <OutlinedInput
                            id="returnUrl"
                            label="Return URL"
                            type="text"
                            autoComplete="returnUrl"
                            {...register("returnUrl")}
                            error={!!errors.returnUrl?.message}
                          />
                          <FormHelperText error={!!errors.returnUrl?.message}>
                            {errors.returnUrl?.message ??
                              "Provide a URL where the user will be redirected after successful authentication. E.g: https://oridune.com/login/callback/{{code}}"}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={3} xs={12}>
                  <Typography variant="subtitle2" component="div" marginTop={1}>
                    Branding
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="grey"
                    marginTop={1}
                  >
                    Configure the branding of your app's consent screen.
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box sx={{ marginY: 1 }}>
                    <Grid container rowGap={1} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Grid spacing={1} container>
                          <Grid
                            display="flex"
                            sx={{ gap: 1, alignItems: "center" }}
                            item
                            md={6}
                          >
                            <FormControl
                              sx={{ flexGrow: 1 }}
                              variant="outlined"
                            >
                              <InputLabel htmlFor="primaryColor">
                                Primary Color
                              </InputLabel>
                              <OutlinedInput
                                id="primaryColor"
                                label="Primary Color"
                                type="text"
                                autoComplete="primaryColor"
                                startAdornment={
                                  <InputAdornment position="start">
                                    #
                                  </InputAdornment>
                                }
                                {...register("consentPrimaryColor")}
                                error={!!errors.consentPrimaryColor?.message}
                              />
                            </FormControl>
                            <Box
                              sx={{
                                backgroundColor: `#${
                                  watch().consentPrimaryColor
                                }`,
                                display: "block",
                                width: 35,
                                height: 35,
                                borderRadius: "10px",
                              }}
                            ></Box>
                          </Grid>
                          <Grid
                            display="flex"
                            sx={{ gap: 1, alignItems: "center" }}
                            item
                            md={6}
                          >
                            <FormControl variant="outlined">
                              <InputLabel htmlFor="secondaryColor">
                                Secondary Color
                              </InputLabel>
                              <OutlinedInput
                                id="secondaryColor"
                                label="Secondary Color"
                                type="text"
                                autoComplete="secondaryColor"
                                startAdornment={
                                  <InputAdornment position="start">
                                    #
                                  </InputAdornment>
                                }
                                {...register("consentSecondaryColor")}
                                error={!!errors.consentSecondaryColor?.message}
                              />
                            </FormControl>
                            <Box
                              sx={{
                                backgroundColor: `#${
                                  watch().consentSecondaryColor
                                }`,
                                display: "block",
                                width: 35,
                                height: 35,
                                borderRadius: "10px",
                              }}
                            ></Box>
                          </Grid>
                          <Grid item xs={12}>
                            <FormHelperText
                              error={
                                !!errors.consentPrimaryColor?.message ||
                                !!errors.consentSecondaryColor?.message
                              }
                            >
                              {errors.consentPrimaryColor?.message ??
                                errors.consentSecondaryColor?.message ??
                                "Choose the colors for the OAuth consent screen. These colors will be used for the branding of your app."}
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  sx={{ display: "flex", justifyContent: "end" }}
                  item
                  md={9}
                  xs={12}
                >
                  <LoadingButton
                    loading={Loading}
                    type="submit"
                    variant="contained"
                  >
                    Create
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
