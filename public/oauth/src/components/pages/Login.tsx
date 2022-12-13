import React from "react";
import { Copyright } from "../misc/Copyright";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Input } from "../utils/Input";
import { PasswordInput } from "../utils/PasswordInput";

import Logo from "../../assets/logo.svg";
import Google from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";
import Github from "../../assets/github.png";
import Discord from "../../assets/discord.png";

export const LoginPage = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 333 }}>
        <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
          <img width={50} height={50} src={Logo} alt="Logo" />
        </Box>
        <Typography component="h1" variant="h6" textAlign="center">
          Sign In to Continue
        </Typography>
        <Grid container spacing={1} sx={{ marginY: 3 }}>
          <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip arrow placement="top" title="Continue with Google">
              <IconButton>
                <img src={Google} width={20} height={20} alt="Google" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip arrow placement="top" title="Continue with Facebook">
              <IconButton>
                <img src={Facebook} width={20} height={20} alt="Facebook" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip arrow placement="top" title="Continue with Github">
              <IconButton>
                <img src={Github} width={20} height={20} alt="Github" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip arrow placement="top" title="Continue with Discord">
              <IconButton>
                <img src={Discord} width={20} height={20} alt="Discord" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%" }}>
          <Typography variant="subtitle2" color="GrayText">
            or sign in with your credentials
          </Typography>
        </Divider>
        <Box component="form" onSubmit={handleSubmit} sx={{ marginY: 3 }}>
          <Grid container rowGap={1} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Input id="username" label="Username" fullWidth />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "right" }}
            >
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <PasswordInput id="password" label="Password" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained">
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ width: "100%" }}>
          <Typography variant="subtitle2" color="GrayText">
            See also
          </Typography>
        </Divider>
        <Typography color="primary" textAlign="center" sx={{ marginY: 2 }}>
          <Link href="#" variant="body2">
            Support
          </Link>
          <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
          <Link href="#" variant="body2">
            Terms of Services
          </Link>
          <span style={{ margin: "0px 10px 0px 10px" }}>•</span>
          <Link href="#" variant="body2">
            Privacy Policy
          </Link>
        </Typography>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Box>
    </div>
  );
};
