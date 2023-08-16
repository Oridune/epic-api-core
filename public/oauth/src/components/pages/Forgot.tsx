import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";

import { ValidatorResolver } from "../utils/validatorResolver";
import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.svg";

export const ForgotSchema = e.object({
  username: e
    .string({
      messages: { matchFailed: "Please provide a valid username format!" },
    })
    .matches(/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
    .length(50),
});

export const RecoverySchema = e.object({
  code: e.number({ cast: true }).length(6),
  password: e
    .string({
      messages: {
        matchFailed:
          "A password should be 8 characters long, must contain an uppercase, a lowercase, a number and a special character!",
      },
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/
    ),
  confirmPassword: e.string().custom((ctx) => {
    if (ctx.parent!.output.password !== ctx.output)
      throw "Password doesn't match!";
  }),
});

export const ForgotPage = () => {
  const Navigate = useNavigate();

  const { app } = useOauthApp();

  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);
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

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm<InferOutput<typeof ForgotSchema>>({
    resolver: ValidatorResolver(ForgotSchema),
  });

  const {
    register: registerRecovery,
    handleSubmit: handleSubmitRecovery,
    formState: { errors: errorsRecovery },
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
        { baseURL: import.meta.env.VITE_API_HOST }
      );

      if (Response.data.status) {
        if (Response.data.data.availableMethods instanceof Array) {
          setUsername(data.username);
          setAvailableMethods(Response.data.data.availableMethods);
          setRecoveryMethod(Response.data.data.availableMethods[0].type);
        } else setErrorMessage(`Invalid response pattern!`);
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

    try {
      const Response = await axios.get(
        `/api/users/identification/recovery/${Username}/${RecoveryMethod}`,
        { baseURL: import.meta.env.VITE_API_HOST }
      );

      if (Response.data.status) {
        if (typeof Response.data.data.token === "string") {
          setToken(Response.data.data.token);
          setResendCounter(0);
        } else setErrorMessage(`Invalid response pattern!`);
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
        { baseURL: import.meta.env.VITE_API_HOST }
      );

      if (Response.data.status) Navigate(`/login/${window.location.search}`);
      else setErrorMessage(Response.data.messages[0].message);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        setErrorMessage(
          error.response?.data.messages[0].message ?? error.message
        );
    }

    setLoading(false);
  };

  React.useEffect(() => {
    const Interval = setInterval(() => setResendCounter((c) => c + 1), 1000);

    return () => {
      clearInterval(Interval);
    };
  });

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
          <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
            <img
              width={70}
              height={70}
              src={app?.consent.logo?.url ?? Logo}
              alt="Logo"
              onClick={() => {
                window.location.href = app!.consent.homepageURL;
              }}
              onError={(e) => {
                if (app?.consent.logo?.url) {
                  e.persist();
                  e.currentTarget.src = Logo;
                }
              }}
            />
          </Box>
          {!AvailableMethods ? (
            <>
              <Typography component="h1" variant="h6" textAlign="center">
                Recover your password!
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
                      <InputLabel htmlFor="username">Username</InputLabel>
                      <OutlinedInput
                        id="username"
                        label="Username"
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
                      Recover
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
                      Login instead?
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
                      Don't have an account?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : !Token ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                We need to verify your identity!
              </Typography>
              <Box sx={{ marginY: 3 }}>
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
                    <FormControl>
                      <FormLabel id="recovery-method-label">
                        How would you like to get the security code?
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="recovery-method-label"
                        value={RecoveryMethod}
                        onChange={(e) => {
                          e.persist();
                          setRecoveryMethod(e.currentTarget.value);
                        }}
                      >
                        {AvailableMethods.map((method, index) => (
                          <FormControlLabel
                            key={index}
                            control={<Radio />}
                            label={`${method.type.toUpperCase()} ${
                              method.maskedValue
                            }`}
                            value={method.type}
                          />
                        ))}
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
                      Get Code
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                You may receive an OTP
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
                      <InputLabel htmlFor="code">OTP Code</InputLabel>
                      <OutlinedInput
                        id="code"
                        label="OTP Code"
                        type="number"
                        autoComplete="code"
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
                      onClick={() => {
                        setToken(null);
                      }}
                      variant="body2"
                    >
                      Change Method?
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
                        if (ResendCounter >= 60) {
                          HandleRequestRecovery();
                        }
                      }}
                      variant="body2"
                      color={ResendCounter < 60 ? "#808080" : undefined}
                    >
                      {ResendCounter >= 60
                        ? "Re-send code?"
                        : `Re-send code in ${60 - ResendCounter}s`}
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        id="password"
                        label="Password"
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
                        Re-Type
                      </InputLabel>
                      <OutlinedInput
                        id="confirm-password"
                        label="Re-Type"
                        type={ShowConfirmPassword ? "text" : "password"}
                        autoComplete="confirm-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmPassword((_) => !_)}
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
                      Update Password
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
