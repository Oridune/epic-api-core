import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Chip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { ValidatorResolver } from "../utils/validatorResolver";
import { useOauthApp } from "../context/OauthApp";

import { DotMenu } from "../misc/DotMenu";
import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";

export const VerifyPage = () => {
  const Navigate = useNavigate();
  const Params = useParams();
  const [Query, setQuery] = useSearchParams();

  const { app } = useOauthApp();

  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const [AvailableMethods, setAvailableMethods] = React.useState<null | Array<{
    type: string;
    maskedValue: string;
    verified: boolean;
  }>>(null);
  const [VerificationMethod, setVerificationMethod] = React.useState<
    null | string
  >(null);
  const [Token, setToken] = React.useState<null | string>(null);
  const [ResendCounter, setResendCounter] = React.useState(0);

  React.useEffect(() => {
    if (Params.username) fetchContacts(Params.username);
    const Interval = setInterval(() => setResendCounter((c) => c + 1), 1000);

    return () => {
      clearInterval(Interval);
    };
  }, []);

  const fetchContacts = async (username: string) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.get(
        `/api/users/identification/methods/${username}`,
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
        }
      );

      if (Response.data.status) {
        if (Response.data.data.availableMethods instanceof Array)
          setAvailableMethods(Response.data.data.availableMethods);
        else setErrorMessage(t("Invalid response pattern!"));
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
          {!Token && VerificationMethod ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("Change your contact")}
              </Typography>
              <Box
                component="form"
                // onSubmit={handleSubmitRecovery(HandleRecovery)}
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
                </Grid>
              </Box>
            </motion.div>
          ) : !Token ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("Change or verify your contacts")}
              </Typography>
              <Box sx={{ marginY: 3 }}>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                      {ErrorMessage && (
                        <Alert
                          severity="error"
                          onClose={() => {
                            if (Params.username) fetchContacts(Params.username);
                            setErrorMessage(null);
                          }}
                        >
                          {ErrorMessage}
                        </Alert>
                      )}
                    </Stack>
                  </Grid>
                  {!ErrorMessage && (
                    <Grid item xs={12}>
                      {AvailableMethods instanceof Array ? (
                        <List
                          subheader={
                            <ListSubheader>
                              {t("Your contacts list")}
                            </ListSubheader>
                          }
                        >
                          {AvailableMethods.map((method, index) => (
                            <React.Fragment key={index}>
                              <ListItem
                                alignItems="flex-start"
                                secondaryAction={
                                  <DotMenu
                                    id={`options-${index}`}
                                    options={[
                                      {
                                        label: t("Verify"),
                                        onClick: () => {},
                                        disabled: method.verified,
                                      },
                                      {
                                        label: t("Change"),
                                        onClick: () =>
                                          setVerificationMethod(method.type),
                                      },
                                    ]}
                                    edge="end"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "right",
                                    }}
                                  />
                                }
                              >
                                <ListItemText
                                  primary={
                                    method.type.charAt(0).toUpperCase() +
                                    method.type.slice(1)
                                  }
                                  secondary={
                                    <React.Fragment>
                                      {method.maskedValue}{" "}
                                      {method.verified ? (
                                        <Chip
                                          label={t("Verified")}
                                          color="success"
                                          variant="outlined"
                                          size="small"
                                        />
                                      ) : (
                                        <Chip
                                          label={t("Unverified")}
                                          color="error"
                                          variant="outlined"
                                          size="small"
                                        />
                                      )}
                                    </React.Fragment>
                                  }
                                />
                              </ListItem>
                              {AvailableMethods.length > index + 1 && (
                                <Divider component="li" />
                              )}
                            </React.Fragment>
                          ))}
                        </List>
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
                // onSubmit={handleSubmitRecovery(HandleRecovery)}
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
