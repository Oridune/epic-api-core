import React from "react";
import { Divider, Link, Typography } from "@mui/material";
import { Copyright } from "./Copyright";
import { useOauthApp } from "../context/OauthApp";

export const ConsentFooter = () => {
  const { app } = useOauthApp();

  if (!app) return <></>;

  return (
    <>
      {(app.consent.supportURL ||
        app.consent.termsAndConditionsURL ||
        app.consent.privacyPolicyURL) && (
        <>
          <Divider sx={{ width: "100%" }}>
            <Typography variant="subtitle2" color="GrayText">
              See also
            </Typography>
          </Divider>
          <Typography color="primary" textAlign="center" sx={{ marginY: 2 }}>
            {[
              {
                label: "Support",
                href: app.consent.supportURL,
              },
              {
                label: "Terms of Services",
                href: app.consent.termsAndConditionsURL,
              },
              {
                label: "Privacy Policy",
                href: app.consent.privacyPolicyURL,
              },
            ]
              .filter((_) => !!_.href)
              .map(({ label, href }, index) => (
                <React.Fragment key={index}>
                  {index !== 0 && (
                    <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
                  )}
                  <Link href={href} variant="body2">
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
    </>
  );
};
