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
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "../../../../assets/logo.svg";

export interface ListItemProps {
  label: string;
  path: string;
  icon?: string;
  items?: ListItemProps[];
}

export const CustomListItem: React.FC<ListItemProps> = ({
  label,
  path,
  icon,
  items,
}) => {
  const Location = useLocation();
  const Navigate = useNavigate();
  const Selected = new RegExp(`^/${path.replace(/^\/|\/$/g, "")}`).test(
    Location.pathname
  );

  const [Expanded, setExpanded] = React.useState(Selected);

  return (
    <>
      <ListItem disablePadding sx={{ marginTop: 0.5 }}>
        <ListItemButton
          selected={!(items instanceof Array) && Selected}
          onClick={() => {
            if (items instanceof Array) setExpanded((_) => !_);
            else Navigate(path);
          }}
        >
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
          {items.map(({ label, path: subPath, icon }) => (
            <Collapse key={label} in={Expanded} timeout="auto" unmountOnExit>
              <List dense disablePadding>
                <ListItemButton
                  selected={
                    Selected &&
                    new RegExp(
                      `^${path.replace(/^\/|\/$/g, "")}/${subPath.replace(
                        /^\/|\/$/g,
                        ""
                      )}`
                    ).test(Location.pathname.replace(/^\/|\/$/g, ""))
                  }
                  sx={{ marginTop: 0.5, pl: 4 }}
                  onClick={() =>
                    Navigate(
                      `/${[path, subPath]
                        .map((p) => p.trim().replace(/^\/|\/$/g, ""))
                        .join("/")}`
                    )
                  }
                >
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
              path: "/overview",
              icon: "spa",
            },
            {
              label: "OAuth",
              path: "/oauth",
              icon: "lock_person",
              items: [
                {
                  label: "All Apps",
                  path: "/all/apps",
                },
                {
                  label: "Apps",
                  path: "/apps",
                },
                {
                  label: "Preferences",
                  path: "/preferences",
                },
              ],
            },
            {
              label: "Files",
              path: "/files",
              icon: "gallery_thumbnail",
              items: [
                {
                  label: "View",
                  path: "/view",
                },
                {
                  label: "Preferences",
                  path: "/preferences",
                },
              ],
            },
            {
              label: "Plugins",
              path: "/plugins",
              icon: "electrical_services",
            },
            {
              label: "API",
              path: "/api",
              icon: "integration_instructions",
              items: [
                {
                  label: "Webhooks",
                  path: "/webhooks",
                },
                {
                  label: "Events",
                  path: "/events",
                },
                {
                  label: "Logs",
                  path: "/logs",
                },
              ],
            },
            {
              label: "Settings",
              path: "/settings",
              icon: "settings",
              items: [
                {
                  label: "General",
                  path: "/general",
                },
                {
                  label: "Profile",
                  path: "/profile",
                },
              ],
            },
            {
              label: "Activity",
              path: "/activity",
              icon: "history",
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
        </List>
        <Box sx={{ height: "50px" }} />
      </Box>
    </Box>
  );
};
