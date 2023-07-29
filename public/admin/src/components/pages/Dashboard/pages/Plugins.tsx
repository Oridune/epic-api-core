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
  InputAdornment,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey, red } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import { HeaderPartial } from "../partials/Header";
import { EmptyPartial } from "../partials/Empty";

import { CustomDialog, ICustomDialogRef } from "../../../utils/Dialog";
import { TGetTokens, useAuth } from "../../../context/auth";

export interface IPlugin {
  id: string;
  version: string;
  name: string;
  description: string;
  homepage?: string;
  icon?: string;
  enabled?: boolean;
}

export interface IPluginItemProps {
  id: string;
  version: string;
  name: string;
  description: string;
  homepage?: string;
  icon?: string;
  enabled?: boolean;
  onToggleEnable?: (
    this: HTMLButtonElement,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    props: IPluginItemProps
  ) => void | Promise<any>;
  onDelete?: (
    this: HTMLButtonElement,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    props: IPluginItemProps
  ) => void | Promise<any>;
}

export const PluginItem: React.FC<IPluginItemProps> = (props) => {
  const {
    id,
    version,
    name,
    description,
    homepage,
    icon,
    enabled,
    onToggleEnable,
    onDelete,
  } = props;
  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  return (
    <Grid id={id} item md={3}>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.2, delay: 0.1 },
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        style={{ cursor: "pointer" }}
      >
        <Box
          bgcolor={grey["50"]}
          border={1}
          borderColor={ErrorMessage ? red["300"] : grey["300"]}
          borderRadius={3}
          padding={1}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                padding={1}
                bgcolor={grey["100"]}
                borderRadius={3}
                width="25px"
                height="25px"
                sx={{
                  backgroundImage: icon ? `url(${icon})` : undefined,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {!icon && (
                  <Icon sx={{ color: "gray" }}>electrical_services</Icon>
                )}
              </Box>
              <Box>
                {typeof onToggleEnable === "function" && (
                  <LoadingButton
                    variant="text"
                    size="small"
                    color={enabled ? "error" : "success"}
                    loading={Loading}
                    onClick={async function (this: any, e) {
                      setLoading(true);
                      setErrorMessage(null);

                      try {
                        await onToggleEnable.bind(this)(e, props);
                      } catch (error) {
                        const Message: string = (error as any).message ?? error;
                        setErrorMessage(Message);
                        console.error(error);
                      }

                      setLoading(false);
                    }}
                  >
                    {enabled ? "Disable" : "Enable"}
                  </LoadingButton>
                )}
                {typeof onDelete === "function" && (
                  <IconButton
                    size="small"
                    color="error"
                    disabled={Loading}
                    onClick={async function (this: any, e) {
                      setLoading(true);
                      setErrorMessage(null);

                      try {
                        await onDelete.bind(this)(e, props);
                      } catch (error) {
                        const Message: string = (error as any).message ?? error;
                        setErrorMessage(Message);
                        console.error(error);
                      }

                      setLoading(false);
                    }}
                  >
                    <Icon fontSize="small">delete</Icon>
                  </IconButton>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="div" marginTop={1}>
                {name}
                <span style={{ color: "gray" }}>@{version}</span>
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="grey"
                marginTop={1}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {description}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                textAlign="right"
                sx={{ opacity: homepage ? 1 : 0 }}
              >
                <Link target="_blank" href={homepage}>
                  Homepage
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Grid>
  );
};

export const AddPlugin =
  <D extends any>(getTokens: TGetTokens) =>
  async (name: string) => {
    const Token = (await getTokens()?.resolveTokens())?.access.token;
    const Response = await axios.post<{
      status: boolean;
      data: D;
      messages: { message: string }[];
    }>(
      "/api/admin/plugins/",
      { name: name },
      {
        baseURL: import.meta.env.VITE_API_HOST,
        validateStatus: (status) => status < 500,
        headers: {
          Authorization: Token && `Bearer ${Token}`,
        },
      }
    );

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );

    return Response.data;
  };

export const FetchPlugins =
  <D extends any>(getTokens: TGetTokens) =>
  async () => {
    const Token = (await getTokens()?.resolveTokens())?.access.token;
    const Response = await axios.get<{
      status: boolean;
      data: D;
      messages: { message: string }[];
    }>("/api/admin/plugins/", {
      baseURL: import.meta.env.VITE_API_HOST,
      validateStatus: (status) => status < 500,
      headers: {
        Authorization: Token && `Bearer ${Token}`,
      },
    });

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );

    return Response.data;
  };

export const ToggleEnablePlugin =
  (getTokens: TGetTokens) => async (id: string) => {
    const Token = (await getTokens()?.resolveTokens())?.access.token;
    const Response = await axios.patch<{
      status: boolean;
      data: {
        name: string;
        enabled: boolean;
      };
      messages: { message: string }[];
    }>(
      "/api/admin/plugins/toggle/enable/",
      { name: id },
      {
        baseURL: import.meta.env.VITE_API_HOST,
        validateStatus: (status) => status < 500,
        headers: {
          Authorization: Token && `Bearer ${Token}`,
        },
      }
    );

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );
    return Response.data;
  };

export const DeletePlugin = (getTokens: TGetTokens) => async (id: string) => {
  const Token = (await getTokens()?.resolveTokens())?.access.token;
  const Response = await axios.delete<{
    status: boolean;
    messages: { message: string }[];
  }>("/api/admin/plugins/" + encodeURIComponent(id), {
    baseURL: import.meta.env.VITE_API_HOST,
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: Token && `Bearer ${Token}`,
    },
  });

  if (!Response.data.status)
    throw new Error(
      Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
    );
  return Response.data;
};

export const PluginsPage = () => {
  const Navigate = useNavigate();

  const { getTokens } = useAuth();

  const PluginsFetcher = FetchPlugins<Array<IPlugin>>(getTokens);

  const QueryClient = useQueryClient();

  const { data, error, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof PluginsFetcher>>,
    Error | AxiosError
  >("plugins", PluginsFetcher);

  const [NewPlugin, setNewPlugin] = React.useState("");

  const CreatePluginDialogRef = React.createRef<ICustomDialogRef>();
  const DeletePluginDialogRef = React.createRef<ICustomDialogRef>();

  return (
    <>
      <HeaderPartial label="Plugins" />
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
            <Typography color="text.primary">Plugins</Typography>
          </Breadcrumbs>
          <Box
            sx={{ marginY: 2, height: "calc(100% - 50px)", overflow: "auto" }}
          >
            <Box
              bgcolor={grey["50"]}
              borderRadius={3}
              padding={1}
              marginBottom={2}
              display={"flex"}
            >
              <Box display="flex" gap={1} flexGrow={1}>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="search">Search</InputLabel>
                  <OutlinedInput
                    id="search"
                    label="Search"
                    type="search"
                    autoComplete="search"
                    endAdornment={
                      <InputAdornment position="end">
                        <Icon>search</Icon>
                      </InputAdornment>
                    }
                    sx={{
                      backgroundColor: "white",
                    }}
                  />
                </FormControl>
                <IconButton>
                  <Icon>sort_by_alpha</Icon>
                </IconButton>
                <IconButton>
                  <Icon>tune</Icon>
                </IconButton>
              </Box>
              <Box display={"flex"} gap={1}>
                <LoadingButton
                  variant="contained"
                  size="small"
                  onClick={() => {
                    CreatePluginDialogRef.current?.open();
                  }}
                >
                  Add Plugin
                </LoadingButton>
              </Box>
            </Box>
            {isLoading || isError || !data?.data.length ? (
              <EmptyPartial
                isLoading={isLoading}
                isError={isError}
                message={error?.message}
                onRefresh={() => refetch()}
              />
            ) : (
              <Grid container spacing={1}>
                {data.data.map((item) => (
                  <PluginItem
                    key={item.id}
                    id={item.id}
                    version={item.version}
                    name={item.name}
                    description={item.description}
                    homepage={item.homepage}
                    icon={item.icon}
                    enabled={item.enabled}
                    onToggleEnable={async (_, props) => {
                      await ToggleEnablePlugin(getTokens)(props.id).catch(
                        (error) => new Notification(error.message)
                      );
                      await QueryClient.invalidateQueries("plugins");
                    }}
                    onDelete={async (_, props) => {
                      if (
                        await DeletePluginDialogRef.current?.confirm({
                          title: "Are you sure?",
                          description: `You are about the delete the plugin '${item.id}'! Do you want to continue?`,
                        })
                      ) {
                        await DeletePlugin(getTokens)(props.id).catch(
                          (error) => new Notification(error.message)
                        );
                        await QueryClient.invalidateQueries("plugins");
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
      <CustomDialog
        id="create-plugin"
        ref={CreatePluginDialogRef}
        title="Add Plugin"
        description="Add a new plugin to the system. The plugin will be automatically enabled once installed!"
        agreeLabel="Add"
        disagreeLabel="Cancel"
        onAgree={async () => {
          await AddPlugin(getTokens)(NewPlugin).catch(
            (error) => new Notification(error.message)
          );
          setNewPlugin("");
          CreatePluginDialogRef.current?.close();
          await QueryClient.invalidateQueries("plugins");
        }}
        onDisagree={() => setNewPlugin("")}
        onClose={() => CreatePluginDialogRef.current?.close()}
      >
        <Box paddingY={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="pluginId">Plugin ID</InputLabel>
            <OutlinedInput
              id="pluginId"
              label="Plugin ID"
              type="text"
              autoComplete="pluginId"
              value={NewPlugin}
              onChange={(e) => {
                e.persist();
                const Target = e.currentTarget;
                setNewPlugin(Target.value);
              }}
            />
            <FormHelperText>
              For example: Saff-Elli-Khan/epic-api-core
            </FormHelperText>
          </FormControl>
        </Box>
      </CustomDialog>
      <CustomDialog id="delete-plugin" ref={DeletePluginDialogRef} />
    </>
  );
};
