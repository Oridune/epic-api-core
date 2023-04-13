import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/auth";

export interface HeaderPartialProps {
  label: string;
}

export const HeaderPartial: React.FC<HeaderPartialProps> = ({ label }) => {
  const { setTokens } = useAuth();

  const [AnchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const Open = Boolean(AnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "60px",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          paddingX: 2,
          maxWidth: "72rem",
          marginX: "auto",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <motion.div
            animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, x: 15 }}
          >
            <Typography variant="h6" component="div">
              {label}
            </Typography>
          </motion.div>
        </Box>
        <Box>
          <Tooltip arrow placement="left" title="Notifications">
            <IconButton size="small" sx={{ ml: 2, bgcolor: grey["100"] }}>
              <Icon>notifications</Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip arrow placement="left" title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={AnchorEl}
            id="account-menu"
            open={Open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                borderRadius: 2,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem dense>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem dense>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem dense>
              <ListItemIcon>
                <Icon>add_business</Icon>
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem dense>
              <ListItemIcon>
                <Icon>settings</Icon>
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              dense
              onClick={() => {
                setTokens(null);
                window.location.href = "/oauth/login/";
              }}
            >
              <ListItemIcon>
                <Icon color="error">power_settings_new</Icon>
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
            <MenuItem
              dense
              onClick={() => {
                setTokens(null);
                window.location.href = "/oauth/login/";
              }}
            >
              <ListItemIcon>
                <Icon color="error">power_settings_new</Icon>
              </ListItemIcon>
              <Typography color="error">Logout All Devices</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};
