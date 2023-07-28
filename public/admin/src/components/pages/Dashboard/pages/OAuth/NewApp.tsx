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
  consentPrimaryColor: e.string().matches(/^(?:[0-9a-fA-F]{3}){1,2}$/),
  consentSecondaryColor: e.string().matches(/^(?:[0-9a-fA-F]{3}){1,2}$/),
  logoURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
    { nullish: true }
  ),
  homepageURL: e.string().custom((ctx) => new URL(ctx.output).toString()),
  allowedCallbackURLs: e
    .array(
      e.string().custom((ctx) => new URL(ctx.output).toString()),
      { cast: true, splitter: /\s*,\s*/ }
    )
    .length({ min: 1 }),
  privacyPolicyURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
    { nullish: true }
  ),
  termsAndConditionsURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
    { nullish: true }
  ),
  supportURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
    { nullish: true }
  ),
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
          consent: {
            logo: data.logoURL ? { url: data.logoURL } : undefined,
            primaryColor: `#${data.consentPrimaryColor}`,
            secondaryColor: `#${data.consentSecondaryColor}`,
            allowedCallbackURLs: data.allowedCallbackURLs,
            homepageURL: data.homepageURL,
            privacyPolicyURL: data.privacyPolicyURL ?? undefined,
            termsAndConditionsURL: data.termsAndConditionsURL ?? undefined,
            supportURL: data.supportURL ?? undefined,
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
    defaultValues: {
      consentPrimaryColor: "e85d04",
      consentSecondaryColor: "faa307",
    },
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
                          <InputLabel htmlFor="name">Name*</InputLabel>
                          <OutlinedInput
                            id="name"
                            label="Name*"
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
                    Consent Branding
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
                                Primary Color*
                              </InputLabel>
                              <OutlinedInput
                                id="primaryColor"
                                label="Primary Color*"
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
                                Secondary Color*
                              </InputLabel>
                              <OutlinedInput
                                id="secondaryColor"
                                label="Secondary Color*"
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

                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel htmlFor="logoURL">Logo URL</InputLabel>
                          <OutlinedInput
                            id="logoURL"
                            label="Logo URL"
                            type="text"
                            autoComplete="logoURL"
                            {...register("logoURL")}
                            error={!!errors.logoURL?.message}
                          />
                          <FormHelperText error={!!errors.logoURL?.message}>
                            {errors.logoURL?.message ??
                              "Provide a valid logo URL of your app. E.g: https://oridune.com/logo.png"}
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
                    Consent Options
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="grey"
                    marginTop={1}
                  >
                    Configure the OAuth consent options of your application.
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box sx={{ marginY: 1 }}>
                    <Grid container rowGap={1} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Grid spacing={1} container>
                          <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="homepageURL">
                                Homepage URL*
                              </InputLabel>
                              <OutlinedInput
                                id="homepageURL"
                                label="Homepage URL*"
                                type="text"
                                autoComplete="homepageURL"
                                {...register("homepageURL")}
                                error={!!errors.homepageURL?.message}
                              />
                              <FormHelperText
                                error={!!errors.homepageURL?.message}
                              >
                                {errors.homepageURL?.message ??
                                  "Provide a valid homepage URL of your app. E.g: https://oridune.com"}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="allowedCallbackURLs">
                                Callback URL(s)*
                              </InputLabel>
                              <OutlinedInput
                                id="allowedCallbackURLs"
                                label="Callback URL(s)*"
                                type="text"
                                autoComplete="allowedCallbackURLs"
                                {...register("allowedCallbackURLs")}
                                error={!!errors.allowedCallbackURLs?.message}
                              />
                              <FormHelperText
                                error={!!errors.allowedCallbackURLs?.message}
                              >
                                {errors.allowedCallbackURLs?.message ??
                                  "Provide a URL where the user will be redirected after successful authentication (E.g: https://oridune.com/login/callback/). You can also provide multiple URLs separated with a comma."}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="privacyPolicyURL">
                                Privacy Policy URL
                              </InputLabel>
                              <OutlinedInput
                                id="privacyPolicyURL"
                                label="Privacy Policy URL"
                                type="text"
                                autoComplete="privacyPolicyURL"
                                {...register("privacyPolicyURL")}
                                error={!!errors.privacyPolicyURL?.message}
                              />
                              <FormHelperText
                                error={!!errors.privacyPolicyURL?.message}
                              >
                                {errors.privacyPolicyURL?.message ??
                                  "Provide a URL to your application's privacy policy."}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="termsAndConditionsURL">
                                Terms & Conditions
                              </InputLabel>
                              <OutlinedInput
                                id="termsAndConditionsURL"
                                label="Terms & Conditions"
                                type="text"
                                autoComplete="termsAndConditionsURL"
                                {...register("termsAndConditionsURL")}
                                error={!!errors.termsAndConditionsURL?.message}
                              />
                              <FormHelperText
                                error={!!errors.termsAndConditionsURL?.message}
                              >
                                {errors.termsAndConditionsURL?.message ??
                                  "Provide a URL to your application's terms & conditions."}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="supportURL">
                                Support URL
                              </InputLabel>
                              <OutlinedInput
                                id="supportURL"
                                label="Support URL"
                                type="text"
                                autoComplete="supportURL"
                                {...register("supportURL")}
                                error={!!errors.supportURL?.message}
                              />
                              <FormHelperText
                                error={!!errors.supportURL?.message}
                              >
                                {errors.supportURL?.message ??
                                  "Provide a support URL."}
                              </FormHelperText>
                            </FormControl>
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
