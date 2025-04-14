import React from "react";
import ReactGA4 from "react-ga4";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  LinearProgress,
  Alert,
  Stack,
  List,
  ListItem,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Link,
  Avatar,
  Chip,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import KeyIcon from "@mui/icons-material/Key";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import axios, { AxiosError } from "../utils/axios";
import { useTranslation } from "react-i18next";

import { IOauthApp } from "../context/OauthApp";
import { ConsentFooter } from "../misc/ConsentFooter";

import Logo from "../../assets/logo.png";

export const convertScopeMapToObject = (
  map: Map<string, Set<string> | null>
) => {
  const obj: Record<string, string[]> = {};

  for (const [key, value] of map.entries()) {
    if (value === null) obj[key] = ["*"];
    else {
      value.add("role:unauthenticated");

      obj[key] = Array.from(value);
    }
  }

  return obj;
};

export const ScopesPage = () => {
  const Navigate = useNavigate();
  const Location = useLocation();
  const [Query] = useSearchParams();

  const RequestedScopes = (Query.get("scopes") ?? "")
    .split(",")
    .map(($) => $.trim())
    .filter(Boolean);

  if (!Location.state?.app) {
    React.useEffect(() => {
      Navigate(`/login/${window.location.search}`);
    }, []);

    return <></>;
  }

  const state = Location.state as {
    app: IOauthApp;
    codeChallenge: string | null;
    codeChallengeMethod: string | null;
    callbackURL: string;
    callbackState: string | null;
    authenticationToken: { token: string };
    availableScopes: Array<{
      isOwned: boolean;
      isPrimary: boolean;
      account: {
        _id: string;
        name: string;
        description?: string;
        logo?: { url: string };
      };
    }>;
  };

  const app = state.app;

  React.useEffect(() => {
    ReactGA4.send({
      hitType: "pageview",
      page: Location.pathname,
      title: "Scopes",
    });
  }, []);

  const defaultScopeState = (
    app?.consent.thirdPartyApp?.allowedScopes ?? []
  ).map(({ label, description, scope }) => {
    const requested = RequestedScopes.includes(scope);

    return {
      label,
      description,
      scope,
      requested,
    };
  });

  const allScopes = (
    app?.consent.thirdPartyApp?.allowedScopes ?? []
  ).map(({scope}) => scope);

  const defaultScopes = RequestedScopes.length
    ? new Set(RequestedScopes)
    : new Set(allScopes);

  const [SelectedScopes, setSelectedScopes] = React.useState<
    Map<string, Set<string>>
  >(new Map([[state.availableScopes[0].account._id, defaultScopes]]));

  const [Loading, setLoading] = React.useState(false);

  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { t } = useTranslation();

  const HandleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);
    setLoading(true);

    try {
      const ExchangeResponse = await axios.post(
        "/api/oauth/exchange/authentication",
        {
          authenticationToken: state.authenticationToken.token,
          scopes: convertScopeMapToObject(SelectedScopes),
        }
      );

      if (ExchangeResponse.data.status) {
        const RedirectURLWithCode = new URL(state.callbackURL);

        RedirectURLWithCode.searchParams.set(
          "code",
          ExchangeResponse.data.data.oauthCode.token
        );

        if (state.callbackState)
          RedirectURLWithCode.searchParams.set("state", state.callbackState);

        window.location.replace(RedirectURLWithCode.toString());
      } else setErrorMessage(ExchangeResponse.data.messages?.[0]?.message);
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
      <Helmet>
        <title>{t("Review Access")}</title>
        <meta
          name="description"
          content={t("Review what this app can do with your account")}
        />
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
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              marginY: 2,
              cursor: "pointer",
            }}
          >
            {app?.consent.thirdPartyApp?.logo?.url &&
            app?.consent.logo?.url !== app?.consent.thirdPartyApp?.logo?.url ? (
              <>
                <img
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "100%",
                    borderColor: "white",
                    borderWidth: "2px",
                  }}
                  src={app?.consent.logo?.url ?? Logo}
                  alt="Logo"
                  onError={(e) => {
                    if (app?.consent.logo?.url) {
                      e.persist();
                      e.currentTarget.src = Logo;
                    }
                  }}
                />
                <LinkIcon style={{ color: "gray" }} />
                <img
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "100%",
                  }}
                  src={app.consent.thirdPartyApp.logo.url}
                  alt={app.consent.thirdPartyApp.name ?? "Third party app logo"}
                  onError={(e) => {
                    if (app?.consent.logo?.url) {
                      e.persist();
                      e.currentTarget.src = Logo;
                    }
                  }}
                />
              </>
            ) : (
              <img
                width={60}
                height={60}
                style={{
                  borderRadius: "100%",
                }}
                src={app?.consent.logo?.url ?? Logo}
                alt="Logo"
                onError={(e) => {
                  if (app?.consent.logo?.url) {
                    e.persist();
                    e.currentTarget.src = Logo;
                  }
                }}
              />
            )}
          </Box>
          <Typography component="h1" variant="h6" textAlign="center">
            {t(
              "{{thirdPartyAppName}} wants to access your {{appName}} account",
              {
                thirdPartyAppName:
                  app?.consent.thirdPartyApp?.name ?? "Unknown",
                appName: app?.name ?? "current",
              }
            )}
          </Typography>
          <Box component="form" onSubmit={HandleApprove} sx={{ marginY: 3 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                {t("See what {{thirdPartyAppName}} can access", {
                  thirdPartyAppName:
                    app?.consent.thirdPartyApp?.name ?? "Unknown",
                })}
              </Typography>
            </Grid>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                  {ErrorMessage && (
                    <Alert
                      severity="error"
                      onClose={() => setErrorMessage(null)}
                    >
                      {ErrorMessage ?? t("Something went wrong!")}
                    </Alert>
                  )}
                </Stack>
              </Grid>
              {defaultScopeState.length ? (
                state.availableScopes.map(
                  ({
                    isPrimary,
                    account: { _id, name, description, logo },
                  }) => (
                    <Grid key={`account-${_id}`} item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            alt={name}
                            src={logo?.url}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {name ?? _id}{" "}
                              {isPrimary && (
                                <Chip
                                  variant="outlined"
                                  label="Primary"
                                  size="small"
                                  color="primary"
                                />
                              )}
                            </Typography>
                            <Typography variant="caption">
                              {description}
                            </Typography>
                          </Box>
                        </Box>
                        <Checkbox
                          edge="end"
                          checked={SelectedScopes.has(_id)}
                          onChange={() => {
                            if (SelectedScopes.has(_id))
                              SelectedScopes.delete(_id);
                            else SelectedScopes.set(_id, defaultScopes);

                            setSelectedScopes(new Map(SelectedScopes));
                          }}
                        />
                      </Box>
                      {SelectedScopes.has(_id) && (
                        <List>
                          {defaultScopeState.map(
                            (
                              { label, description, scope, requested },
                              index
                            ) => (
                              <React.Fragment key={`scope-${_id}-${index}`}>
                                <ListItem
                                  secondaryAction={
                                    requested ? (
                                      <Checkbox edge="end" checked disabled />
                                    ) : (
                                      <Checkbox
                                        edge="end"
                                        checked={
                                          !SelectedScopes.get(_id) ||
                                          SelectedScopes.get(_id)!.has(scope)
                                        }
                                        onChange={() => {
                                          const target =
                                            SelectedScopes.get(_id);

                                          if (!target) {
                                            SelectedScopes.set(
                                              _id,
                                              new Set([scope])
                                            );

                                            setSelectedScopes(
                                              new Map(SelectedScopes)
                                            );

                                            return;
                                          }

                                          if (target.has(scope))
                                            target.delete(scope);
                                          else target.add(scope);

                                          setSelectedScopes(
                                            new Map(SelectedScopes)
                                          );
                                        }}
                                      />
                                    )
                                  }
                                  disablePadding
                                >
                                  <ListItemIcon>
                                    <KeyIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Typography variant="subtitle2">
                                        {label}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography variant="caption">
                                        {description}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                                <Divider />
                              </React.Fragment>
                            )
                          )}
                        </List>
                      )}
                    </Grid>
                  )
                )
              ) : (
                <Typography color={"red"}>
                  {t("You cannot login to this app!")}
                </Typography>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" mt={3}>
                  {t("Make sure you trust {{thirdPartyAppName}}", {
                    thirdPartyAppName:
                      app?.consent.thirdPartyApp?.name ?? "Unknown",
                  })}
                </Typography>
                <Typography variant="caption">
                  {t(
                    "You may be sharing sensitive info with this site or app. You can always remove the access from our dashboard."
                  )}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  gap: 2,
                }}
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
                  {t("Cancel?")}
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={Loading || !defaultScopeState.length || !SelectedScopes.size}
                >
                  {t("Continue")}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <ConsentFooter />
        </Box>
      </motion.div>
    </>
  );
};
