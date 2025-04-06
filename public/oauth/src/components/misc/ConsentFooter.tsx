import React from "react";
import { Divider, Link, Typography } from "@mui/material";
import { Copyright } from "./Copyright";
import { Credits } from "./Credits";
import { useOauthApp } from "../context/OauthApp";
import { useTranslation } from "react-i18next";

export const ConsentFooter = () => {
  const { app } = useOauthApp();
  const { t } = useTranslation();

  if (!app) return <></>;

  return (
    <>
      {app.consent.thirdPartyApp
        ? (app.consent.thirdPartyApp.supportURL ||
            app.consent.thirdPartyApp.termsAndConditionsURL ||
            app.consent.thirdPartyApp.privacyPolicyURL) && (
            <>
              <Divider sx={{ width: "100%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("See also")}
                </Typography>
              </Divider>
              <Typography
                color="primary"
                textAlign="center"
                sx={{ marginY: 2 }}
              >
                {[
                  {
                    label: t("Support"),
                    href: app.consent.thirdPartyApp.supportURL,
                  },
                  {
                    label: t("Terms of Services"),
                    href: app.consent.thirdPartyApp.termsAndConditionsURL,
                  },
                  {
                    label: t("Privacy Policy"),
                    href: app.consent.thirdPartyApp.privacyPolicyURL,
                  },
                ]
                  .filter((_) => !!_.href)
                  .map(({ label, href }, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && (
                        <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
                      )}
                      <Link href={href} variant="body2" target="_blank">
                        {label}
                      </Link>
                    </React.Fragment>
                  ))}
              </Typography>
            </>
          )
        : (app.consent.supportURL ||
            app.consent.termsAndConditionsURL ||
            app.consent.privacyPolicyURL) && (
            <>
              <Divider sx={{ width: "100%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("See also")}
                </Typography>
              </Divider>
              <Typography
                color="primary"
                textAlign="center"
                sx={{ marginY: 2 }}
              >
                {[
                  {
                    label: t("Support"),
                    href: app.consent.supportURL,
                  },
                  {
                    label: t("Terms of Services"),
                    href: app.consent.termsAndConditionsURL,
                  },
                  {
                    label: t("Privacy Policy"),
                    href: app.consent.privacyPolicyURL,
                  },
                ]
                  .filter((_) => !!_.href)
                  .map(({ label, href }, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && (
                        <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
                      )}
                      <Link href={href} variant="body2" target="_blank">
                        {label}
                      </Link>
                    </React.Fragment>
                  ))}
              </Typography>
            </>
          )}
      <Copyright
        name={app.name}
        href={app.consent.homepageURL}
        typographyProps={{ sx: { mt: 8, mb: 4 } }}
      />
      <Credits />
    </>
  );
};
