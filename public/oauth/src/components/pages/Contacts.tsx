import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import e, { InferOutput } from "@oridune/validator";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { ValidatorResolver } from "../utils/validatorResolver";
import { EmailValidator, PhoneValidator } from "../utils/validators";

import { useOauthApp } from "../context/OauthApp";

import { DotMenu } from "../misc/DotMenu";
import { ConsentFooter } from "../misc/ConsentFooter";
import { PhoneField } from "../misc/PhoneField";

import Logo from "../../assets/logo.png";

export const ContactsPage = () => {
  const Params = useParams();
  const [Query] = useSearchParams();

  const { app } = useOauthApp();

  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const [DialingCode, setDialingCode] = React.useState<string | null>(null);
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

  const ChangeContactSchema = React.useMemo(
    () =>
      e.object({
        email: e.optional(EmailValidator(t)),
        phone: e.optional(PhoneValidator(t)),
      }),
    [i18n.language]
  );

  const VerificationSchema = React.useMemo(
    () =>
      e.object({
        code: e.number({ cast: true }).length(6),
      }),
    [i18n.language]
  );

  const {
    register: registerChangeContact,
    handleSubmit: handleSubmitChangeContact,
    formState: { errors: errorsChangeContact },
    reset: resetChangeContact,
  } = useForm<InferOutput<typeof ChangeContactSchema>>({
    resolver: ValidatorResolver(ChangeContactSchema),
  });

  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
    formState: { errors: errorsVerification },
    reset: resetVerification,
  } = useForm<InferOutput<typeof VerificationSchema>>({
    resolver: ValidatorResolver(VerificationSchema),
  });

  const HandleChangeContact: SubmitHandler<
    InferOutput<typeof ChangeContactSchema>
  > = async (data) => {
    setErrorMessage(null);
    setLoading(true);

    if (VerificationMethod)
      try {
        const Response = await axios.put(
          `/api/users/${VerificationMethod}`,
          {
            [VerificationMethod]: `${DialingCode}${parseInt(
              data[VerificationMethod as "email" | "phone"] ?? "0"
            )}`,
          },
          {
            baseURL: import.meta.env.VITE_API_HOST,
            headers: {
              "X-Api-Version": import.meta.env.VITE_API_VERSION,
              Authorization: `Permit ${Query.get("permit")}`,
            },
          }
        );

        if (Response.data.status) {
          resetChangeContact();
          setVerificationMethod(null);
          if (Params.username) await fetchContacts(Params.username);
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

  const HandleVerification: SubmitHandler<
    InferOutput<typeof VerificationSchema>
  > = async (data) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.post(
        `/api/users/verify/`,
        {
          method: VerificationMethod,
          token: Token,
          code: data.code,
        },
        {
          baseURL: import.meta.env.VITE_API_HOST,
          headers: {
            "X-Api-Version": import.meta.env.VITE_API_VERSION,
          },
        }
      );

      if (Response.data.status) {
        resetVerification();
        setVerificationMethod(null);
        setToken(null);
        if (Params.username) await fetchContacts(Params.username);
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

  const requestVerification = async (username: string, method: string) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const Response = await axios.get(
        `/api/users/identification/verification/${username}/${method}`,
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

  const ReturnURL = Query.get("returnUrl");

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
                onSubmit={handleSubmitChangeContact(HandleChangeContact)}
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
                    {VerificationMethod === "email" ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="email">{t("Email")}</InputLabel>
                        <OutlinedInput
                          id="email"
                          label={t("Email")}
                          type="text"
                          autoComplete="email"
                          error={!!errorsChangeContact.email?.message}
                          {...registerChangeContact("email")}
                        />
                        <FormHelperText
                          error={!!errorsChangeContact.email?.message}
                        >
                          {errorsChangeContact.email?.message}
                        </FormHelperText>
                      </FormControl>
                    ) : VerificationMethod === "phone" ? (
                      <PhoneField
                        id="phone"
                        label={t("Phone")}
                        autoComplete="phone"
                        placeholder="0XXXXXXXXXX"
                        errorMessage={errorsChangeContact.phone?.message}
                        defaultCountryCode={
                          app?.consent.availableCountryCodes?.[0]
                        }
                        allowedCountryCodes={app?.consent.availableCountryCodes}
                        onPhoneNumberChange={({ dialingCode }) => {
                          setDialingCode(dialingCode);
                        }}
                        {...registerChangeContact("phone")}
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={Loading}
                    >
                      {t("Change")}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href="#return-back"
                      onClick={(e) => {
                        e.preventDefault();
                        setErrorMessage(null);
                        setVerificationMethod(null);
                      }}
                      variant="body2"
                    >
                      {t("Return back?")}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          ) : !Token && !VerificationMethod ? (
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
                          {AvailableMethods.map((method, index) => {
                            const verify = async () => {
                              if (Params.username) {
                                await requestVerification(
                                  Params.username,
                                  method.type
                                );

                                setVerificationMethod(method.type);
                              }
                            };

                            const MenuOptions = [
                              {
                                label: t("Verify"),
                                onClick: verify,
                                disabled: method.verified,
                              },
                              {
                                label: t("Change"),
                                onClick: () =>
                                  setVerificationMethod(method.type),
                                disabled: !Query.get("permit"),
                              },
                            ];

                            const EnabledOptions = MenuOptions.filter(
                              (_) => !_.disabled
                            );

                            return (
                              <React.Fragment key={index}>
                                <ListItem
                                  secondaryAction={
                                    EnabledOptions.length > 1 && (
                                      <DotMenu
                                        id={`options-${index}`}
                                        options={MenuOptions}
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
                                    )
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      method.type.charAt(0).toUpperCase() +
                                      method.type.slice(1)
                                    }
                                    secondary={method.maskedValue}
                                  />

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
                                      onClick={verify}
                                    />
                                  )}

                                  {EnabledOptions.length < 2 && (
                                    <Button
                                      type="button"
                                      variant="contained"
                                      style={{ marginLeft: "10px" }}
                                      disabled={Loading}
                                      onClick={EnabledOptions[0].onClick}
                                    >
                                      {EnabledOptions[0].label}
                                    </Button>
                                  )}
                                </ListItem>
                                {AvailableMethods.length > index + 1 && (
                                  <Divider component="li" />
                                )}
                              </React.Fragment>
                            );
                          })}
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
                  {ReturnURL && (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Link href={ReturnURL} variant="body2">
                        {t("Return back?")}
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </motion.div>
          ) : Token && VerificationMethod ? (
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Typography component="h1" variant="h6" textAlign="center">
                {t("You may receive an OTP")}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitVerification(HandleVerification)}
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
                        error={!!errorsVerification.code?.message}
                        {...registerVerification("code")}
                      />
                      <FormHelperText
                        error={!!errorsVerification.code?.message}
                      >
                        {errorsVerification.code?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Link
                      href={ResendCounter >= 60 ? "#resend-otp" : undefined}
                      onClick={() => {
                        if (ResendCounter >= 60 && Params.username)
                          requestVerification(
                            Params.username,
                            VerificationMethod
                          );
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
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={Loading}
                    >
                      {t("Verify")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          ) : null}
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
