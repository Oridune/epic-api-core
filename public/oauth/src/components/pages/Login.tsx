import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  LinearProgress,
  Stack,
  Alert,
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
// import Google from "../../assets/google.png";
// import Facebook from "../../assets/facebook.png";
// import Github from "../../assets/github.png";
// import Discord from "../../assets/discord.png";

export const LoginSchema = e.object({
  username: e
    .string({
      messages: { matchFailed: "Please provide a valid username format!" },
    })
    .matches(/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
    .length(50),
  password: e
    .string({
      messages: {
        typeError: "Please provide a valid password!",
        smallerLength: "Password is required!",
      },
    })
    .length({ min: 1, max: 300 }),
  remember: e.or([e.string(), e.boolean()]).custom((ctx) => !!ctx.output),
});

export const LoginPage = () => {
  const Navigate = useNavigate();
  const [Params] = useSearchParams();

  const CodeChallenge = Params.get("codeChallenge");
  const CodeChallengeMethod = Params.get("codeChallengeMethod");
  const CallbackURL = Params.get("callbackURL");

  const { app } = useOauthApp();

  const [ShowPassword, setShowPassword] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InferOutput<typeof LoginSchema>>({
    resolver: ValidatorResolver(LoginSchema),
  });

  const HandleLogin: SubmitHandler<InferOutput<typeof LoginSchema>> = async (
    data
  ) => {
    setLoading(true);

    try {
      const LoginResponse = await axios.post(
        "/api/oauth/local/",
        {
          oauthAppId: app!._id,
          codeChallenge: CodeChallenge ?? undefined,
          codeChallengeMethod: CodeChallengeMethod ?? undefined,
          callbackURL:
            CallbackURL ?? app!.consent.allowedCallbackURLs[0] ?? undefined,
          remember: data.remember,
        },
        {
          baseURL: import.meta.env.VITE_API_HOST,
          auth: {
            username: data.username,
            password: data.password,
          },
        }
      );

      if (LoginResponse.data.status) {
        if (false)
          Navigate("/scopes/", {
            state: {
              appId: app!._id,
              codeChallenge: CodeChallenge,
              codeChallengeMethod: CodeChallengeMethod,
              callbackURL: CallbackURL,
              ...LoginResponse.data.data,
            },
          });
        else {
          const ExchangeResponse = await axios.post(
            "/api/oauth/exchange/authentication",
            {
              authenticationToken:
                LoginResponse.data.data.authenticationToken.token,
              scopes: (
                LoginResponse.data.data.availableScopes as Array<{
                  account: { _id: string };
                }>
              ).reduce(
                (obj, collaboration) => ({
                  ...obj,
                  [collaboration.account._id]: ["*"],
                }),
                {}
              ),
            },
            { baseURL: import.meta.env.VITE_API_HOST }
          );

          if (ExchangeResponse.data.status) {
            const RedirectURL =
              CallbackURL ?? app!.consent.allowedCallbackURLs[0];

            if (RedirectURL) {
              const RedirectURLWithCode = new URL(RedirectURL);

              RedirectURLWithCode.searchParams.set(
                "code",
                ExchangeResponse.data.data.oauthCode.token
              );

              window.location.href = RedirectURLWithCode.toString();
            }
          } else setErrorMessage(ExchangeResponse.data.messages?.[0]?.message);
        }
      } else setErrorMessage(LoginResponse.data.messages?.[0]?.message);
    } catch (error) {
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
            Sign In to Continue
          </Typography>

          {/* <Grid container spacing={1} sx={{ marginY: 3 }}>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Tooltip arrow placement="top" title="Continue with Google">
                <IconButton>
                  <img src={Google} width={20} height={20} alt="Google" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Tooltip arrow placement="top" title="Continue with Facebook">
                <IconButton>
                  <img src={Facebook} width={20} height={20} alt="Facebook" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Tooltip arrow placement="top" title="Continue with Github">
                <IconButton>
                  <img src={Github} width={20} height={20} alt="Github" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Tooltip arrow placement="top" title="Continue with Discord">
                <IconButton>
                  <img src={Discord} width={20} height={20} alt="Discord" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider sx={{ width: "100%" }}>
            <Typography variant="subtitle2" color="GrayText">
              or sign in with your credentials
            </Typography>
          </Divider> */}

          <Box
            component="form"
            onSubmit={handleSubmit(HandleLogin)}
            sx={{ marginY: 3 }}
          >
            <Grid container rowGap={1} sx={{ mb: 2 }}>
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
                    error={!!errors.username?.message}
                    {...register("username")}
                  />
                  <FormHelperText error={!!errors.username?.message}>
                    {errors.username?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Link
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    Navigate(e.currentTarget.getAttribute("href")!);
                  }}
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
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
                  <FormHelperText error={!!errors.password?.message}>
                    {errors.password?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      {...register("remember")}
                    />
                  }
                  label="Remember me"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  Sign In
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Link
                  href="/signup"
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
