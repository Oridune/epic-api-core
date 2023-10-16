import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Link,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  LinearProgress,
  Alert,
  Stack,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { ValidatorResolver } from "../utils/validatorResolver";
import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";

export const ForgotPage = () => {
  const Navigate = useNavigate();
  const [Query, setQuery] = useSearchParams();

  const { app } = useOauthApp();

  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const [Username, setUsername] = React.useState<null | string>(null);
  const [AvailableMethods, setAvailableMethods] = React.useState<null | Array<{
    type: string;
    maskedValue: string;
  }>>(null);
  const [RecoveryMethod, setRecoveryMethod] = React.useState<null | string>(
    null
  );
  const [Token, setToken] = React.useState<null | string>(null);
  const [ResendCounter, setResendCounter] = React.useState(0);
  const [ShowPassword, setShowPassword] = React.useState(false);
  const [ShowConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const ForgotSchema = React.useMemo(
    () =>
      e.object({
        username: e
          .string({
            messages: {
              matchFailed: t("Please provide a valid username format!"),
            },
          })
          .matches(/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
          .length(50),
      }),
    [i18n.language]
  );

  const RecoverySchema = React.useMemo(
    () =>
      e.object({
        code: e.number({ cast: true }).length(6),
        password: e
          .string({
            messages: {
              matchFailed: t(
                "A password should be 8 characters long, must contain an uppercase, a lowercase, a number and a special character!"
              ),
            },
          })
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/
          ),
        confirmPassword: e.string().custom((ctx) => {
          if (ctx.parent!.output.password !== ctx.output)
            throw t("Password doesn't match!");
        }),
      }),
    [i18n.language]
  );

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    reset: resetForgot,
  } = useForm<InferOutput<typeof ForgotSchema>>({
    resolver: ValidatorResolver(ForgotSchema),
  });

  const {
    register: registerRecovery,
    handleSubmit: handleSubmitRecovery,
    formState: { errors: errorsRecovery },
    reset: resetRecovery,
  } = useForm<InferOutput<typeof RecoverySchema>>({
    resolver: ValidatorResolver(RecoverySchema),
  });

  const HandleForgot: SubmitHandler<InferOutput<typeof ForgotSchema>> = async (
    data
  ) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.get(
        `/api/users/identification/methods/${data.username}`,
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
        }
      );

      if (Response.data.status) {
        if (Response.data.data.availableMethods instanceof Array) {
          resetForgot();
          setUsername(data.username);
          setAvailableMethods(Response.data.data.availableMethods);
          setRecoveryMethod(Response.data.data.availableMethods[0].type);
        } else setErrorMessage(t("Invalid response pattern!"));
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

  const HandleRequestRecovery = async () => {
    setErrorMessage(null);
    setLoading(true);
    resetRecovery();

    try {
      const Response = await axios.get(
        `/api/users/identification/recovery/${Username}/${RecoveryMethod}`,
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
        }
      );

      if (Response.data.status) {
        if (typeof Response.data.data.token === "string") {
          setToken(Response.data.data.token);
          setResendCounter(0);
        } else setErrorMessage(t("Invalid response pattern!"));
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

  const HandleRecovery: SubmitHandler<
    InferOutput<typeof RecoverySchema>
  > = async (data) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.put(
        `/api/users/password/`,
        {
          method: RecoveryMethod,
          token: Token,
          code: data.code,
          password: data.password,
        },
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
        }
      );

      if (Response.data.status) {
        resetRecovery();
        if (QueryReturnURL) window.location.replace(QueryReturnURL);
        else Navigate(`/login/${window.location.search}`);
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

  const QueryUsername = Query.get("username");
  const QueryReturnURL = Query.get("returnUrl");

  React.useEffect(() => {
    if (QueryUsername) HandleForgot({ username: QueryUsername });
  }, [QueryUsername]);

  React.useEffect(() => {
    const Interval = setInterval(() => setResendCounter((c) => c + 1), 1000);

    return () => {
      clearInterval(Interval);
    };
  }, []);

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
          {!AvailableMethods && !QueryUsername ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("Recover your password!")}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitForgot(HandleForgot)}
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
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="username">
                        {t("Username")}
                      </InputLabel>
                      <OutlinedInput
                        id="username"
                        label={t("Username")}
                        type="text"
                        autoComplete="username"
                        error={!!errorsForgot.username?.message}
                        {...registerForgot("username")}
                      />
                      <FormHelperText error={!!errorsForgot.username?.message}>
                        {errorsForgot.username?.message}
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
                      {t("Recover")}
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
                      }}
                      variant="body2"
                    >
                      {t("Login instead?")}
                    </Link>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href={`/signup/${window.location.search}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const Path = e.currentTarget.getAttribute("href")!;
                        if (Path) Navigate(Path);
                      }}
                      variant="body2"
                    >
                      {t("Don't have an account?")}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          ) : !Token ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("We need to verify your identity!")}
              </Typography>
              <Box sx={{ marginY: 3 }}>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                      {ErrorMessage && (
                        <Alert
                          severity="error"
                          onClose={() => {
                            Query.delete("username");
                            setQuery(Query);
                            setErrorMessage(null);
                          }}
                        >
                          {ErrorMessage}
                        </Alert>
                      )}
                    </Stack>
                  </Grid>
                  {!ErrorMessage && (
                    <>
                      <Grid item xs={12}>
                        <FormControl>
                          <FormLabel id="recovery-method-label">
                            {t("How would you like to get the security code?")}
                          </FormLabel>
                          <RadioGroup
                            aria-labelledby="recovery-method-label"
                            value={RecoveryMethod}
                            onChange={(e) => {
                              e.persist();
                              setRecoveryMethod(e.currentTarget.value);
                            }}
                          >
                            {AvailableMethods instanceof Array ? (
                              AvailableMethods.map((method, index) => (
                                <FormControlLabel
                                  key={index}
                                  control={<Radio />}
                                  label={`${
                                    method.type.charAt(0).toUpperCase() +
                                    method.type.slice(1)
                                  }: ${method.maskedValue}`}
                                  value={method.type}
                                />
                              ))
                            ) : (
                              <>
                                <Typography component="div" variant="h3">
                                  <Skeleton />
                                </Typography>
                                <Typography component="div" variant="h3">
                                  <Skeleton />
                                </Typography>
                              </>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={HandleRequestRecovery}
                          disabled={Loading}
                        >
                          {t("Get Code")}
                        </Button>
                      </Grid>
                    </>
                  )}
                  {QueryReturnURL ? (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Link href={QueryReturnURL} variant="body2">
                        {t("Return back?")}
                      </Link>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Link
                        href="#change-username"
                        onClick={(e) => {
                          e.preventDefault();
                          setUsername(null);
                          setAvailableMethods(null);
                          Query.delete("username");
                          setQuery(Query);
                        }}
                        variant="body2"
                      >
                        {t("Change Username?")}
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("You may receive an OTP")}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitRecovery(HandleRecovery)}
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
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="code">{t("OTP Code")}</InputLabel>
                      <OutlinedInput
                        id="code"
                        label={t("OTP Code")}
                        type="number"
                        autoComplete="code"
                        inputProps={{
                          min: "100000",
                          max: "999999",
                        }}
                        error={!!errorsRecovery.code?.message}
                        {...registerRecovery("code")}
                      />
                      <FormHelperText error={!!errorsRecovery.code?.message}>
                        {errorsRecovery.code?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href="#change-method"
                      onClick={(e) => {
                        e.preventDefault();
                        setToken(null);
                      }}
                      variant="body2"
                    >
                      {t("Change Method?")}
                    </Link>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href={ResendCounter >= 60 ? "#resend-otp" : undefined}
                      onClick={() => {
                        if (ResendCounter >= 60) HandleRequestRecovery();
                      }}
                      variant="body2"
                      color={ResendCounter < 60 ? "#808080" : undefined}
                    >
                      {ResendCounter >= 60
                        ? t("Re-send code?")
                        : t("Re-send code in {{seconds}}s", {
                            seconds: 60 - ResendCounter,
                          })}
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="password">
                        {t("Password")}
                      </InputLabel>
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
                              {ShowPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        error={!!errorsRecovery.password?.message}
                        {...registerRecovery("password")}
                      />
                      <FormHelperText
                        error={!!errorsRecovery.password?.message}
                      >
                        {errorsRecovery.password?.message}
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
                        error={!!errorsRecovery.confirmPassword?.message}
                        {...registerRecovery("confirmPassword")}
                      />
                      <FormHelperText
                        error={!!errorsRecovery.confirmPassword?.message}
                      >
                        {errorsRecovery.confirmPassword?.message}
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
                      {t("Update Password")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          )}
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
