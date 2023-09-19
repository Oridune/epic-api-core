import { Typography, Link } from "@mui/material";
import Logo from "../../assets/logo.png";

export const Credits = () => {
  return (
    <Typography variant="body2" align="center" sx={{ mb: "20px" }}>
      <Link color="#e85d04" href="https://oridune.com" target="_blank">
        <img
          style={{ verticalAlign: "middle" }}
          width={20}
          height={20}
          src={Logo}
          alt="Oridune"
        />{" "}
        Powered by Oridune
      </Link>
    </Typography>
  );
};
