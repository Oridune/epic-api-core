import Typography, { TypographyProps } from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

export const Copyright = (props: {
  name: string;
  href: string;
  typographyProps?: TypographyProps;
}) => {
  const { t } = useTranslation();

  return (
    <Typography
      variant="subtitle2"
      color="text.secondary"
      align="center"
      {...props.typographyProps}
    >
      {t("Copyright © ")}
      <Link color="inherit" href={props.href} target="_blank">
        {props.name}
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
};
