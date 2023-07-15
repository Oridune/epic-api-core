import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

export const StateSchema = e.object({
  appId: e.string(),
  codeChallenge: e.optional(e.string(), { nullish: true }),
  codeChallengeMethod: e.optional(e.string(), { nullish: true }),
  callbackURL: e.optional(e.string(), { nullish: true }),
  authenticationToken: e.any(),
  availableScopes: e.any(),
});

export const SignupSchema = e.object({
  fname: e.string().length({ min: 2, max: 30 }),
  lname: e.string(),
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

export const ScopesPage = () => {
  const Navigate = useNavigate();
  const Location = useLocation();

  const { app } = useOauthApp();

  const [ShowPassword, setShowPassword] = React.useState(false);
  const [ShowConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [LoginState, setLoginState] = React.useState<null | InferOutput<
    typeof StateSchema
  >>(null);

  React.useEffect(() => {
    (async () => {
      if (await StateSchema.test(Location.state)) setLoginState(Location.state);
      else
        Navigate(
          "/login?" +
            Object.entries({
              appId: Location.state?.appId,
              codeChallenge: Location.state?.codeChallenge,
              codeChallengeMethod: Location.state?.codeChallengeMethod,
              callbackURL: Location.state?.callbackURL,
            })
              .filter((v) => v[1])
              .map((v) => v.join("="))
              .join("&")
        );
    })();
  }, []);

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

  if (!LoginState) return null;

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
              width={50}
              height={50}
              src={Logo}
              alt="Logo"
              onClick={() => {
                window.location.href = app!.consent.homepageURL;
              }}
            />
          </Box>
          <Typography component="h1" variant="h6" textAlign="center">
            <Link href="#">Oridune</Link> wants to access your account!
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
              <Grid item></Grid>
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
