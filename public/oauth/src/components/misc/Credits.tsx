import { Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.png";

export const Credits: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();

  // return (
  //   <Typography variant="body2" align="center" sx={{ mb: "20px" }}>
  //     <Link color="#e85d04" href="https://oridune.com" target="_blank">
  //       <img
  //         style={{ verticalAlign: "middle" }}
  //         width={20}
  //         height={20}
  //         src={Logo}
  //         alt="Oridune"
  //       />{" "}
  //       {message ?? t("Powered by Oridune")}
  //     </Link>
  //   </Typography>
  // );

  return (
    <Typography variant="body2" align="center" sx={{ mb: "20px" }}>
      <Link color="#e85d04" href="https://huruftech.com" target="_blank">
        <img
          style={{ verticalAlign: "middle" }}
          width={20}
          height={20}
          src={Logo}
          alt="Huruf Tech"
        />{" "}
        {message ?? t("Powered by Huruf Tech")}
      </Link>
    </Typography>
  );
};
