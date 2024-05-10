import React from "react";
import ReactGA4 from "react-ga4";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Link,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  LinearProgress,
  Alert,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { ValidatorResolver } from "../utils/validatorResolver";
import {
  EmailValidator,
  PasswordFormatValidator,
  PhoneValidator,
  UsernameValidator,
} from "../utils/validators";

import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";
import { PhoneField } from "../misc/PhoneField";

import Logo from "../../assets/logo.png";

export const tryAtob = (text: string) => {
  try {
    return atob(text);
  } catch {
    return "";
  }
};

export const SignupPage = () => {
  const Navigate = useNavigate();
  const Location = useLocation();
  const [Query] = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const CustomReference = Query.get("ref");

  const { app } = useOauthApp();

  React.useEffect(() => {
    ReactGA4.send({
      hitType: "pageview",
      page: Location.pathname,
      title: "Signup",
    });
  }, []);

  const [DialingCode, setDialingCode] = React.useState<string | null>(null);
  const [ShowPassword, setShowPassword] = React.useState(false);
  const [ShowConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const SignupSchema = React.useMemo(
    () =>
      e.object({
        fname: e.string().length({ min: 2, max: 30 }),
        lname: e.string(),
        email: app?.consent.requiredIdentificationMethods.includes("email")
          ? EmailValidator(t)
          : undefined,
        phone: app?.consent.requiredIdentificationMethods.includes("phone")
          ? PhoneValidator(t)
          : undefined,
        username: UsernameValidator(t),
        password: PasswordFormatValidator(
          t,
          app?.consent.passwordPolicy?.strength,
          app?.consent.passwordPolicy?.minLength,
          app?.consent.passwordPolicy?.maxLength
        ),
        confirmPassword: e.string().custom((ctx) => {
          if (ctx.parent!.output.password !== ctx.output)
            throw t("Password doesn't match!");
        }),
      }),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InferOutput<typeof SignupSchema>>({
    resolver: ValidatorResolver(SignupSchema),
  });

  const HandleSignup: SubmitHandler<InferOutput<typeof SignupSchema>> = async (
    data
  ) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.post(
        `/api/users/${app!._id}`,
        {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          phone: `${DialingCode}${parseInt(data.phone)}`,
          username: data.username,
          password: data.password,
        },
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
          params: {
            reference: tryAtob(CustomReference ?? "") || undefined,
            reCaptchaV3Token: await executeRecaptcha?.("signup"),
          },
        }
      );

      if (Response.data.status) {
        ReactGA4.event({
          category: "Oauth2",
          action: "Click",
          label: "Signup",
        });

        reset();
        Navigate(`/login/${window.location.search}`);
      } else setErrorMessage(Response.data.messages[0].message);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        setErrorMessage(
          error.response?.data.messages[0].message ?? error.message
        );
    }

    setLoading(false);
  };

  return (
    <>
      <LinearProgress style={{ opacity: Loading ? 1 : 0 }} />
      <motion.div
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, y: 10 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: 333, paddingX: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginY: 2,
              cursor: "pointer",
            }}
          >
            <img
              width={60}
              height={60}
              src={app?.consent.logo?.url ?? Logo}
              alt="Logo"
              onError={(e) => {
                if (app?.consent.logo?.url) {
                  e.persist();
                  e.currentTarget.src = Logo;
                }
              }}
            />
          </Box>
          <Typography component="h1" variant="h6" textAlign="center">
            {t("Sign Up Quickly!")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(HandleSignup)}
            sx={{ marginY: 3 }}
          >
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                  {ErrorMessage && (
                    <Alert
                      severity="error"
                      onClose={() => setErrorMessage(null)}
                    >
                      {ErrorMessage}
                    </Alert>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="fname">{t("First Name")}</InputLabel>
                  <OutlinedInput
                    id="fname"
                    label={t("First Name")}
                    type="text"
                    autoComplete="fname"
                    error={!!errors.fname?.message}
                    {...register("fname")}
                  />
                  <FormHelperText error={!!errors.fname?.message}>
                    {errors.fname?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="lname">{t("Last Name")}</InputLabel>
                  <OutlinedInput
                    id="lname"
                    label={t("Last Name")}
                    type="text"
                    autoComplete="lname"
                    error={!!errors.lname?.message}
                    {...register("lname")}
                  />
                  <FormHelperText error={!!errors.lname?.message}>
                    {errors.lname?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {app?.consent.requiredIdentificationMethods.includes("email") && (
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="email">{t("Email")}</InputLabel>
                    <OutlinedInput
                      id="email"
                      label={t("Email")}
                      type="text"
                      autoComplete="email"
                      error={!!errors.email?.message}
                      {...register("email")}
                    />
                    <FormHelperText error={!!errors.email?.message}>
                      {errors.email?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}

              {app?.consent.requiredIdentificationMethods.includes("phone") && (
                <Grid item xs={12}>
                  <PhoneField
                    id="phone"
                    label={t("Phone")}
                    autoComplete="phone"
                    placeholder="0XXXXXXXXXX"
                    errorMessage={errors.phone?.message}
                    defaultCountryCode={app?.consent.availableCountryCodes?.[0]}
                    allowedCountryCodes={app?.consent.availableCountryCodes}
                    onPhoneNumberChange={({ dialingCode }) => {
                      setDialingCode(dialingCode);
                    }}
                    {...register("phone")}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="username">{t("Username")}</InputLabel>
                  <OutlinedInput
                    id="username"
                    label={t("Username")}
                    type="text"
                    autoComplete="username"
                    error={!!errors.username?.message}
                    {...register("username")}
                  />
                  <FormHelperText error={!!errors.username?.message}>
                    {errors.username?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                  <OutlinedInput
                    id="password"
                    label={t("Password")}
                    type={ShowPassword ? "text" : "password"}
                    autoComplete="password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((_) => !_)}
                          edge="end"
                        >
                          {ShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={!!errors.password?.message}
                    {...register("password")}
                  />
                  <FormHelperText error={!!errors.password?.message}>
                    {errors.password?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="confirm-password">
                    {t("Re-Type")}
                  </InputLabel>
                  <OutlinedInput
                    id="confirm-password"
                    label={t("Re-Type")}
                    type={ShowConfirmPassword ? "text" : "password"}
                    autoComplete="confirm-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword((_) => !_)}
                          edge="end"
                        >
                          {ShowConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={!!errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                  <FormHelperText error={!!errors.confirmPassword?.message}>
                    {errors.confirmPassword?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={Loading}
                >
                  {t("Sign Up")}
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Link
                  href={`/login/${window.location.search}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const Path = e.currentTarget.getAttribute("href")!;
                    if (Path) Navigate(Path);

                    ReactGA4.event({
                      category: "Oauth2",
                      action: "Click",
                      label: "Login instead of Signup",
                    });
                  }}
                  variant="body2"
                >
                  {t("Already have an account?")}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
