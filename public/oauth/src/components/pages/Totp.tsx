import React from "react";
import ReactGA4 from "react-ga4";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Link,
  Typography,
  LinearProgress,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { red, green } from "@mui/material/colors";
import { motion } from "framer-motion";
import axios, { AxiosError } from "../utils/axios";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";

import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";
import { Encrypted } from "../icons/Encrypted";
import { copyToClipboard } from "../utils/copyToClipboard";

export const TotpPage = () => {
  const Location = useLocation();
  const [Query] = useSearchParams();

  const { app } = useOauthApp();

  React.useEffect(() => {
    ReactGA4.send({
      hitType: "pageview",
      page: Location.pathname,
      title: "Setup a Authenticator",
    });
  }, []);

  const [TOTPDetails, setTOTPDetails] = React.useState<{
    _id: string;
    uri: string;
  } | null>(null);
  const [TOTPCode, setTOTPCode] = React.useState("");
  const [TOTPSetup, setTOTPSetup] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t } = useTranslation();

  const GetTOTPUri = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const TOTPChallenge = await axios.post(
        "/api/oauth/2fa/totp/",
        {},
        {
          headers: {
            Authorization: `Permit ${Query.get("permit")}`,
          },
        }
      );

      if (!TOTPChallenge.data.status)
        throw new Error(
          TOTPChallenge.data.messages?.[0]?.message ??
            t("The operation has failed!")
        );

      ReactGA4.event({
        category: "Oauth2",
        action: "Click",
        label: "Setup totp",
      });

      setTOTPDetails(TOTPChallenge.data.data);
    } catch (error: any) {
      console.error(error);
      if (error instanceof AxiosError)
        setErrorMessage(
          error.response?.data.messages[0].message ?? error.message
        );
      else setErrorMessage(error?.message ?? "Something went wrong!!!");
    }

    setLoading(false);
  };

  const HandleTOTPSetup = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const TOTPActivate = await axios.post(
        "/api/oauth/2fa/totp/activate/",
        {
          id: TOTPDetails?._id,
          code: TOTPCode,
        },
        {
          headers: {
            Authorization: `Permit ${Query.get("permit")}`,
          },
        }
      );

      if (!TOTPActivate.data.status)
        throw new Error(
          TOTPActivate.data.messages?.[0]?.message ??
            t("The operation has failed!")
        );

      ReactGA4.event({
        category: "Oauth2",
        action: "Click",
        label: "Activate totp",
      });

      setTOTPSetup(true);
    } catch (error: any) {
      console.error(error);
      if (error instanceof AxiosError)
        setErrorMessage(
          error.response?.data.messages[0].message ?? error.message
        );
      else setErrorMessage(error?.message ?? "Something went wrong!!!");
    }

    setLoading(false);
  };

  const ReturnURL = Query.get("returnUrl");

  return (
    <>
      <Helmet>
        <title>{t("Authenticator")}</title>
        <meta name="description" content={t("Setup authenticator")} />
      </Helmet>
      <LinearProgress style={{ opacity: Loading ? 1 : 0 }} />
      <motion.div
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, y: 10 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "95vh",
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
          <motion.div
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 10 }}
          >
            <Typography
              component="h1"
              variant="h6"
              textAlign="center"
              marginBottom={3}
            >
              {t("Setup an Authenticator")}
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {ErrorMessage && (
                  <Grid item xs={12}>
                    <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                      <Alert severity="error">{ErrorMessage}</Alert>
                    </Stack>
                  </Grid>
                )}
                {
                  <>
                    {!TOTPDetails && (
                      <Grid item xs={12}>
                        <center>
                          <Encrypted />

                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {t(
                              "Secure your account with 2 factor authentication"
                            )}
                          </Typography>
                        </center>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      {!Query.get("permit") ? (
                        <center>
                          <Typography variant="subtitle2" color={red[500]}>
                            {t("Authenticator is not available!")}
                          </Typography>
                        </center>
                      ) : !TOTPSetup ? (
                        TOTPDetails ? (
                          <center>
                            <QRCode value={TOTPDetails.uri} />

                            {copied ? (
                              <Typography
                                variant="subtitle2"
                                mt={1}
                                sx={{
                                  color: "success.main",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {t("Code has been copied")} <CheckIcon />
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                mt={1}
                                sx={{
                                  color: "primary.main",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  const params = new URLSearchParams(
                                    TOTPDetails.uri.split("?")[1]
                                  );

                                  if (!params.get("secret"))
                                    throw new Error("No secret found!");

                                  await copyToClipboard(params.get("secret")!);
                                  
                                  setCopied(true);
                                }}
                              >
                                {t("Copy for manual setup")} <CopyAllIcon />
                              </Typography>
                            )}

                            <Divider sx={{ width: "100%", marginY: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {t("Verify setup")}
                              </Typography>
                            </Divider>

                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ marginBottom: 2 }}
                            >
                              <InputLabel htmlFor="code">
                                {t("OTP Code")}
                              </InputLabel>
                              <OutlinedInput
                                id="code"
                                label={t("OTP Code")}
                                type="number"
                                autoComplete="code"
                                inputProps={{
                                  min: "100000",
                                  max: "999999",
                                }}
                                value={TOTPCode}
                                onChange={(e) => {
                                  setTOTPCode(e.target.value);
                                }}
                              />
                            </FormControl>

                            <Button
                              type="button"
                              fullWidth
                              variant="contained"
                              disabled={Loading}
                              onClick={HandleTOTPSetup}
                            >
                              {t("Verify")}
                            </Button>
                          </center>
                        ) : (
                          <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            disabled={Loading}
                            onClick={GetTOTPUri}
                          >
                            {t("Start setup")}
                          </Button>
                        )
                      ) : (
                        <center>
                          <Typography variant="subtitle2" color={green[500]}>
                            {t("The authenticator setup was successful!")}
                          </Typography>
                        </center>
                      )}
                    </Grid>
                  </>
                }
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
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
