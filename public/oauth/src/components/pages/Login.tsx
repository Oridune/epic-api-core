import React from "react";
import ReactGA4 from "react-ga4";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { VisibilityOff, Visibility, Replay } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { type AxiosResponse, AxiosError } from "../utils/axios";
import { useTranslation } from "react-i18next";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { startAuthentication } from "@simplewebauthn/browser";

import { ValidatorResolver } from "../utils/validatorResolver";
import { PasswordValidator, UsernameValidator } from "../utils/validators";

import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";
// import Google from "../../assets/google.png";
// import Facebook from "../../assets/facebook.png";
// import Github from "../../assets/github.png";
// import Discord from "../../assets/discord.png";

export const LoginPage = () => {
  const Navigate = useNavigate();
  const Location = useLocation();
  const [Query] = useSearchParams();

  const CodeChallenge = Query.get("codeChallenge");
  const CodeChallengeMethod = Query.get("codeChallengeMethod");
  const CallbackURL = Query.get("callbackURL");
  const CallbackState = Query.get("state");
  const Remember = Query.has("remember")
    ? Query.get("remember") === "true"
    : undefined;

  const { app, integrations } = useOauthApp();
  const { executeRecaptcha } = integrations.reCaptchaV3
    ? useGoogleReCaptcha()
    : { executeRecaptcha: () => {} };

  React.useEffect(() => {
    ReactGA4.send({
      hitType: "pageview",
      page: Location.pathname,
      title: "Login",
    });
  }, []);

  const [LoginWithPassword, setLoginWithPassword] = React.useState(
    !app?.consent.passkeyEnabled
  );

  const [ShowPassword, setShowPassword] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const LoginSchema = React.useMemo(
    () =>
      e.object({
        username: UsernameValidator(t),
        ...(LoginWithPassword ? { password: PasswordValidator(t) } : {}),
        remember: e
          .optional(
            e.or([e.boolean(), e.string()]).custom((ctx) => !!ctx.output)
          )
          .default(false),
      }),
    [i18n.language, LoginWithPassword]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<InferOutput<typeof LoginSchema>>({
    resolver: ValidatorResolver(LoginSchema),
  });

  const LoginData = watch();

  const HandleLogin: SubmitHandler<InferOutput<typeof LoginSchema>> = async (
    data
  ) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      let LoginResponse: AxiosResponse<any, any>;

      const LoginPayload = {
        oauthAppId: app!._id,
        codeChallenge: CodeChallenge ?? undefined,
        codeChallengeMethod: CodeChallengeMethod ?? undefined,
        callbackURL:
          CallbackURL ?? app!.consent.allowedCallbackURLs[0] ?? undefined,
        remember: Remember ?? data.remember,
      };

      if (LoginWithPassword) {
        LoginResponse = await axios.post("/api/oauth/local/", LoginPayload, {
          auth: {
            username: data.username,
            password: data.password ?? "",
          },
          params: {
            reCaptchaV3Token: await executeRecaptcha?.("login"),
          },
        });
      } else {
        const PasskeyChallenge = await axios.get(
          "/api/oauth/passkey/challenge/login/",
          {
            params: {
              username: data.username,
              reCaptchaV3Token: await executeRecaptcha?.("passkeyChallenge"),
            },
          }
        );

        if (!PasskeyChallenge.data.status)
          throw new Error(
            PasskeyChallenge.data.messages?.[0]?.message ??
              "Operation has failed!"
          );

        LoginResponse = await axios.post(
          "/api/oauth/passkey/login/",
          {
            username: data.username,
            credentials: await startAuthentication(
              PasskeyChallenge.data.data.challenge
            ).catch((error) => {
              console.error(error);
              throw new Error("Operation timed out or cancelled!");
            }),
            ...LoginPayload,
          },
          {
            params: {
              reCaptchaV3Token: await executeRecaptcha?.("login"),
            },
          }
        );
      }

      if (LoginResponse && LoginResponse.data.status) {
        ReactGA4.event({
          category: "Oauth2",
          action: "Click",
          label: "Login",
        });

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
            }
          );

          if (ExchangeResponse.data.status) {
            reset();

            const RedirectURL =
              CallbackURL ?? app!.consent.allowedCallbackURLs[0];

            if (RedirectURL) {
              const RedirectURLWithCode = new URL(RedirectURL);

              RedirectURLWithCode.searchParams.set(
                "code",
                ExchangeResponse.data.data.oauthCode.token
              );

              if (CallbackState)
                RedirectURLWithCode.searchParams.set("state", CallbackState);

              window.location.replace(RedirectURLWithCode.toString());
            }
          } else setErrorMessage(ExchangeResponse.data.messages?.[0]?.message);
        }
      } else setErrorMessage(LoginResponse.data.messages?.[0]?.message);
    } catch (error: any) {
      if (error instanceof AxiosError)
        setErrorMessage(
          error.response?.data.messages[0].message ?? error.message
        );
      else setErrorMessage(error?.message ?? "Something went wrong!!!");
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
            {t("Sign In to Continue")}
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
            <Typography variant="subtitle2" color="text.secondary">
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
                  <InputLabel htmlFor="username">{t("Username")}</InputLabel>
                  <OutlinedInput
                    id="username"
                    label="Username"
                    type="text"
                    autoComplete="username"
                    error={!!errors.username?.message}
                    endAdornment={
                      LoginWithPassword &&
                      app?.consent.passkeyEnabled && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="change username"
                            onClick={() => {
                              reset();
                              setLoginWithPassword(false);
                            }}
                            edge="end"
                          >
                            <Replay />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                    {...register("username", {
                      value: Query.get("username") ?? "",
                    })}
                    disabled={LoginWithPassword && app?.consent.passkeyEnabled}
                  />
                  <FormHelperText error={!!errors.username?.message}>
                    {errors.username?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {!LoginWithPassword && (
                <>
                  {typeof Remember === "undefined" && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            {...register("remember")}
                          />
                        }
                        label={t("Remember me")}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={Loading}
                      onClick={async () => {
                        if (await trigger()) setLoginWithPassword(true);
                      }}
                    >
                      {t("Continue")}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ width: "100%" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("or")}
                      </Typography>
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="inherit"
                      sx={{ color: "black" }}
                      disabled={Loading}
                      onClick={handleSubmit(HandleLogin)}
                    >
                      {t("Sign in with a passkey")}
                    </Button>
                  </Grid>
                </>
              )}
              {LoginWithPassword && (
                <>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href={`/forgot/${(() => {
                        if (!LoginData.username) return window.location.search;

                        const SearchParams = new URLSearchParams(
                          window.location.search
                        );

                        SearchParams.set("username", LoginData.username);

                        return "?" + SearchParams.toString();
                      })()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        Navigate(e.currentTarget.getAttribute("href")!);

                        ReactGA4.event({
                          category: "Oauth2",
                          action: "Click",
                          label: "Forgot password",
                        });
                      }}
                      variant="body2"
                    >
                      {t("Forgot password?")}
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="password">
                        {t("Password")}
                      </InputLabel>
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
                        error={!!errors.password?.message}
                        {...register("password")}
                      />
                      <FormHelperText error={!!errors.password?.message}>
                        {errors.password?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {typeof Remember === "undefined" && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            {...register("remember")}
                          />
                        }
                        label={t("Remember me")}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={Loading}
                    >
                      {t("Sign In")}
                    </Button>
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

                        ReactGA4.event({
                          category: "Oauth2",
                          action: "Click",
                          label: "Create an account",
                        });
                      }}
                      variant="body2"
                    >
                      {t("Don't have an account?")}
                    </Link>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
