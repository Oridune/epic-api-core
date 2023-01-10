import Typography, { TypographyProps } from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const Copyright = (props: {
  name: string;
  href: string;
  typographyProps?: TypographyProps;
}) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props.typographyProps}
    >
      {"Copyright © "}
      <Link color="inherit" href={props.href}>
        {props.name}
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
};
