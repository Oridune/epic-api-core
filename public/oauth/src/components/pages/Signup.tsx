import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
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

import { ValidatorResolver } from "../utils/validatorResolver";
import { useOauthApp } from "../context/OauthApp";

import { Copyright } from "../misc/Copyright";

import Logo from "../../assets/logo.svg";

export const SignupSchema = e.object({
  fname: e.string().length({ min: 2, max: 30 }),
  lname: e.string(),
  email: e
    .string({ messages: { matchFailed: "Please provide a valid email!" } })
    .matches({
      regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
    }),
  username: e
    .string({
      messages: { matchFailed: "Please provide a valid username format!" },
    })
    .matches(/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
    .length(50),
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

export const SignupPage = () => {
  const Navigate = useNavigate();

  const { app } = useOauthApp();

  const [ShowPassword, setShowPassword] = React.useState(false);
  const [ShowConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InferOutput<typeof SignupSchema>>({
    resolver: ValidatorResolver(SignupSchema),
  });

  const HandleSignup: SubmitHandler<InferOutput<typeof SignupSchema>> = async (
    data
  ) => {
    setLoading(true);

    try {
      const Response = await axios.post(
        `/api/users/${app!._id}`,
        {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          username: data.username,
          password: data.password,
        },
        { baseURL: import.meta.env.VITE_API_HOST }
      );

      if (Response.data.status) Navigate("/login");
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
          <Typography component="h1" variant="h6" textAlign="center">
            Sign Up Quickly!
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="fname">First Name</InputLabel>
                  <OutlinedInput
                    id="fname"
                    label="First Name"
                    type="text"
                    autoComplete="fname"
                    error={!!errors.fname?.message}
                    {...register("fname")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="lname">Last Name</InputLabel>
                  <OutlinedInput
                    id="lname"
                    label="Last Name"
                    type="text"
                    autoComplete="lname"
                    error={!!errors.lname?.message}
                    {...register("lname")}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <FormHelperText
                  sx={{ paddingX: 1 }}
                  error={!!errors.fname?.message || !!errors.lname?.message}
                >
                  {errors.fname?.message ?? errors.lname?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    label="Email"
                    type="text"
                    autoComplete="email"
                    error={!!errors.email?.message}
                    {...register("email")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <OutlinedInput
                    id="username"
                    label="Username"
                    type="text"
                    autoComplete="username"
                    error={!!errors.username?.message}
                    {...register("username")}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <FormHelperText
                  sx={{ paddingX: 1 }}
                  error={!!errors.username?.message}
                >
                  {errors.username?.message}
                </FormHelperText>
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
                          {ShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={!!errors.password?.message}
                    {...register("password")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="confirm-password">Re-Type</InputLabel>
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
                          {ShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={!!errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <FormHelperText
                  sx={{ paddingX: 1 }}
                  error={
                    !!errors.password?.message ||
                    !!errors.confirmPassword?.message
                  }
                >
                  {errors.password?.message ?? errors.confirmPassword?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  Sign Up
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Link
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    const Path = e.currentTarget.getAttribute("href")!;
                    if (Path) Navigate(Path);
                  }}
                  variant="body2"
                >
                  Already have an account?
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ width: "100%" }}>
            <Typography variant="subtitle2" color="GrayText">
              See also
            </Typography>
          </Divider>
          <Typography color="primary" textAlign="center" sx={{ marginY: 2 }}>
            <Link href="#" variant="body2">
              Support
            </Link>
            <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
            <Link href="#" variant="body2">
              Terms of Services
            </Link>
            <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
            <Link href="#" variant="body2">
              Privacy Policy
            </Link>
          </Typography>
          <Copyright
            name={app!.name}
            href={app!.consent.homepageURL}
            typographyProps={{ sx: { mt: 8, mb: 4 } }}
          />
        </Box>
      </motion.div>
    </>
  );
};
