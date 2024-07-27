import React from "react";
import ReactGA4 from "react-ga4";
import {
  useParams,
  useSearchParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Link,
  Typography,
  LinearProgress,
  Alert,
  Stack,
} from "@mui/material";
import { red, green } from "@mui/material/colors";
import { motion } from "framer-motion";
import axios, { AxiosError } from "../utils/axios";
import { useTranslation } from "react-i18next";
import { startRegistration } from "@simplewebauthn/browser";

import { useOauthApp } from "../context/OauthApp";

import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";
import { Passkey } from "../icons/Passkey";

export const PasskeyPage = () => {
  const Location = useLocation();
  const [Query] = useSearchParams();

  const { app } = useOauthApp();

  if (!app?.consent.passkeyEnabled)
    return <Navigate to={`/login/${window.location.search}`} />;

  React.useEffect(() => {
    ReactGA4.send({
      hitType: "pageview",
      page: Location.pathname,
      title: "Setup a Passkey",
    });
  }, []);

  const [PasskeySetup, setPasskeySetup] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t } = useTranslation();

  const HandlePasskeySetup = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const PasskeyChallenge = await axios.get(
        "/api/oauth/passkey/challenge/register/",
        {
          headers: {
            Authorization: `Permit ${Query.get("permit")}`,
          },
        }
      );

      if (!PasskeyChallenge.data.status)
        throw new Error(
          PasskeyChallenge.data.messages?.[0]?.message ??
            t("The operation has failed!")
        );

      const VerifyResponse = await axios.post(
        "/api/oauth/passkey/register/",
        {
          credentials: await startRegistration(
            PasskeyChallenge.data.data.challenge
          ),
        },
        {
          headers: {
            Authorization: `Permit ${Query.get("permit")}`,
          },
        }
      );

      if (VerifyResponse.data.status) {
        ReactGA4.event({
          category: "Oauth2",
          action: "Click",
          label: "Verify passkey",
        });

        setPasskeySetup(true);
      } else setErrorMessage(VerifyResponse.data.messages[0].message);
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
          <motion.div
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 10 }}
          >
            <Typography component="h1" variant="h6" textAlign="center">
              {t("Setup a Passkey")}
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
                    <Grid item xs={12} marginY={3}>
                      <center>
                        <Passkey />

                        <Typography variant="subtitle2" color="text.secondary">
                          {t(
                            "Start using passkeys to make getting into your account fast & easy!"
                          )}
                        </Typography>
                      </center>
                    </Grid>
                    <Grid item xs={12}>
                      {!Query.get("permit") ? (
                        <center>
                          <Typography variant="subtitle2" color={red[500]}>
                            {t("Passkey is not available!")}
                          </Typography>
                        </center>
                      ) : !PasskeySetup ? (
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          disabled={Loading}
                          onClick={HandlePasskeySetup}
                        >
                          {t("Start setup")}
                        </Button>
                      ) : (
                        <center>
                          <Typography variant="subtitle2" color={green[500]}>
                            {t("The passkey setup was successful!")}
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
