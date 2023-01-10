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
import Google from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";
import Github from "../../assets/github.png";
import Discord from "../../assets/discord.png";

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
        matchFailed:
          "A password should be 8 characters long, must contain an uppercase, a lowercase, a number and a special character!",
      },
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/
    ),
  remember: e.or([e.string(), e.boolean()]).custom((ctx) => !!ctx.output),
});

export const LoginPage = () => {
  const Navigate = useNavigate();
  const [Params] = useSearchParams();

  const AppID = Params.get("appId");
  const CodeChallenge = Params.get("codeChallenge");
  const CodeChallengeMethod = Params.get("codeChallengeMethod");

  const { app, setAppId } = useOauthApp();

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

  React.useEffect(() => {
    setAppId(AppID!);
  }, [AppID]);

  const HandleLogin: SubmitHandler<InferOutput<typeof LoginSchema>> = async (
    data
  ) => {
    setLoading(true);

    try {
      const Response = await axios.post(
        "/api/oauth/local/",
        {
          oauthAppId: app!._id,
          codeChallenge: CodeChallenge ?? undefined,
          codeChallengeMethod: CodeChallengeMethod ?? undefined,
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

      if (Response.data.status)
        window.location.href = app!.returnUrl.replace(
          /{{\s*AUTH_CODE\s*}}/g,
          Response.data.data.oauthCode.token
        );
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
            <img width={50} height={50} src={Logo} alt="Logo" />
          </Box>
          <Typography component="h1" variant="h6" textAlign="center">
            Sign In to Continue
          </Typography>
          <Grid container spacing={1} sx={{ marginY: 3 }}>
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
          </Divider>
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
                    label="username"
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
                    label="password"
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
                    if (Path) {
                      setLoading(true);
                      setTimeout(() => Navigate(Path), 200);
                    }
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
            name={app!.displayName}
            href={app!.homepageUrl}
            typographyProps={{ sx: { mt: 8, mb: 4 } }}
          />
        </Box>
      </motion.div>
    </>
  );
};
