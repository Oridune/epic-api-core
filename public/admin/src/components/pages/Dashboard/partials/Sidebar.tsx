import React from "react";
import Icon from "@mui/material/Icon";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import Logo from "../../../../assets/logo.svg";

export interface ListItemProps {
  label: string;
  icon?: string;
  items?: ListItemProps[];
}

export const CustomListItem: React.FC<ListItemProps> = ({
  label,
  icon,
  items,
}) => {
  const [Expanded, setExpanded] = React.useState(false);

  return (
    <>
      <ListItem disablePadding sx={{ marginTop: 0.5 }}>
        <ListItemButton onClick={() => setExpanded((_) => !_)}>
          {icon && (
            <ListItemIcon>
              <Icon>{icon}</Icon>
            </ListItemIcon>
          )}
          <ListItemText primary={label} />
          {items?.length && (
            <>
              {Expanded ? (
                <Icon sx={{ color: "gray" }}>expand_less</Icon>
              ) : (
                <Icon sx={{ color: "gray" }}>expand_more</Icon>
              )}
            </>
          )}
        </ListItemButton>
      </ListItem>
      {items?.length && (
        <>
          {items.map(({ label, icon }) => (
            <Collapse key={label} in={Expanded} timeout="auto" unmountOnExit>
              <List dense disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  {icon && (
                    <ListItemIcon>
                      <Icon>{icon}</Icon>
                    </ListItemIcon>
                  )}
                  <ListItemText primary={label} />
                </ListItemButton>
              </List>
            </Collapse>
          ))}
        </>
      )}
    </>
  );
};

export const SidebarPartial = () => {
  return (
    <Box
      bgcolor={grey["50"]}
      sx={{
        width: "100%",
        height: "100vh",
        borderRight: 1,
        borderColor: grey["300"],
      }}
    >
      <Box
        sx={{
          height: "60px",
          paddingX: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          width={40}
          height={40}
          src={Logo}
          alt="Logo"
          style={{ filter: "saturate(130%)" }}
        />
      </Box>
      <Box
        sx={{ height: "calc(100% - 60px)", paddingX: 1, overflowY: "scroll" }}
      >
        <List
          dense
          subheader={
            <ListSubheader sx={{ bgcolor: grey["50"] }}>Menu</ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              sx={{ border: 1, borderColor: grey["300"], bgcolor: "white" }}
            >
              <ListItemIcon>
                <Icon>search</Icon>
              </ListItemIcon>
              <ListItemText primary="Search" />
              <Typography color={grey["600"]}>⌘K</Typography>
            </ListItemButton>
          </ListItem>
          {[
            {
              label: "Overview",
              icon: "spa",
            },
            {
              label: "OAuth",
              icon: "lock_person",
              items: [
                {
                  label: "All Users",
                },
                {
                  label: "Users",
                },
                {
                  label: "Preferences",
                },
              ],
            },
            {
              label: "Plugins",
              icon: "settings_input_hdmi",
            },
            {
              label: "API",
              icon: "integration_instructions",
              items: [
                {
                  label: "API Keys",
                },
                {
                  label: "Webhooks",
                },
                {
                  label: "Events",
                },
                {
                  label: "Logs",
                },
              ],
            },
            {
              label: "Activity",
              icon: "history",
            },
            {
              label: "Settings",
              icon: "settings",
            },
          ].map((item) => (
            <CustomListItem key={item.label} {...item} />
          ))}
        </List>
        <Divider />
        <List dense>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#support">
              <ListItemIcon>
                <Icon>contact_support</Icon>
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#logout">
              <ListItemIcon>
                <Icon color="error">power_settings_new</Icon>
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ height: "50px" }} />
      </Box>
    </Box>
  );
};
