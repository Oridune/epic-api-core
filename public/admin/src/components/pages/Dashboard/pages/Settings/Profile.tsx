import React from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  Icon,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey, red } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import { HeaderPartial } from "../../partials/Header";
import { EmptyPartial } from "../../partials/Empty";

import { CustomDialog, ICustomDialogRef } from "../../../../utils/Dialog";

export const ProfileSettingsPage = () => {
  const Navigate = useNavigate();

  return (
    <>
      <HeaderPartial label="Profile" />
      <Box sx={{ width: "100%", height: "calc(100vh - 60px)" }}>
        <Box
          sx={{
            paddingX: 2,
            maxWidth: "72rem",
            height: "100%",
            marginX: "auto",
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Home
            </Link>
            <Link
              color="inherit"
              href="/settings"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              Settings
            </Link>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>
          <Box
            sx={{ marginY: 2, height: "calc(100% - 50px)", overflow: "auto" }}
          ></Box>
        </Box>
      </Box>
    </>
  );
};
