import React from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Icon,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import { HeaderPartial } from "../../partials/Header";
import { EmptyIndicator, EmptyPartial } from "../../partials/Empty";

import { Virtualizer } from "../../../../utils/Virtualizer";

import { CustomDialog, ICustomDialogRef } from "../../../../utils/Dialog";

import Logo from "../../../../../assets/logo.svg";
import Google from "../../../../../assets/google.png";
import Facebook from "../../../../../assets/facebook.png";
import Github from "../../../../../assets/github.png";
import Discord from "../../../../../assets/discord.png";
import { TGetTokens, useAuth } from "../../../../context/auth";

export interface IOAuthApp {
  _id: string;
  name: string;
  description?: string;
  homepageURL?: string;
}

export interface IAppItemProps {
  appId: string;
  name: string;
  description?: string;
  icon?: string;
  lastItem?: boolean;
  onDelete?: (
    this: HTMLButtonElement,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    props: IAppItemProps
  ) => void | Promise<any>;
}

export const AppItem: React.FC<IAppItemProps> = (props) => {
  const { appId, name, description, icon, lastItem, onDelete } = props;

  const [Loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<string | null>(null);

  return (
    <Box
      display="flex"
      gap={2}
      borderBottom={lastItem ? undefined : 1}
      borderColor={grey["300"]}
      paddingY={1}
    >
      <Box
        padding={1}
        bgcolor={ErrorMessage ? red["100"] : grey["100"]}
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
        {!icon && <Icon sx={{ color: "gray" }}>token</Icon>}
      </Box>
      <Box flexGrow={1}>
        <Typography
          variant="subtitle2"
          component="div"
          marginBottom={0.5}
          title={description}
          sx={{ cursor: "pointer" }}
        >
          {name}
        </Typography>
        <Box display="flex" gap={1}>
          <img src={Logo} width={13} height={13} alt="Logo" />
          <img src={Google} width={13} height={13} alt="Google" />
          <img src={Facebook} width={13} height={13} alt="Facebook" />
          <img src={Github} width={13} height={13} alt="Github" />
          <img src={Discord} width={13} height={13} alt="Discord" />
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flexGrow={1}>
        <Typography variant="body2" component="div">
          App ID:{" "}
          <Chip
            label={appId}
            onDelete={() => {
              window.navigator.clipboard.writeText(appId);
              new Notification("App ID has been Copied!");
            }}
            deleteIcon={<Icon>content_copy</Icon>}
            size="small"
          />
        </Typography>
      </Box>
      <Box>
        <IconButton>
          <Icon>more_vert</Icon>
        </IconButton>
        {typeof onDelete === "function" && (
          <IconButton
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
            <Icon>delete</Icon>
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export const FetchOAuthApps =
  <D extends any>(getTokens: TGetTokens) =>
  async (query: {
    search?: string;
    sort?: string;
    limit: number;
    offset: number;
  }) => {
    const Response = await axios.get<{
      status: boolean;
      data: D;
      messages: { message: string }[];
    }>("/api/oauth/apps/", {
      baseURL: import.meta.env.VITE_API_HOST,
      validateStatus: (status) => status < 500,
      headers: {
        Authorization: `Bearer ${
          (
            await getTokens()?.resolveTokens()
          )?.access.token
        }`,
      },
      params: {
        ...query,
        offset: (query.offset ?? 0) * query.limit,
      },
    });

    if (!Response.data.status)
      throw new Error(
        Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
      );

    return Response.data;
  };

export const DeleteOAuthApp = (getTokens: TGetTokens) => async (id: string) => {
  const Response = await axios.delete<{
    status: boolean;
    messages: { message: string }[];
  }>("/api/oauth/apps/" + encodeURIComponent(id), {
    baseURL: import.meta.env.VITE_API_HOST,
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: `Bearer ${
        (
          await getTokens()?.resolveTokens()
        )?.access.token
      }`,
    },
  });

  if (!Response.data.status)
    throw new Error(
      Response.data.messages?.[0]?.message ?? "Unknown Error Occured!"
    );
  return Response.data;
};

export const AllAppsOAuthPage = () => {
  const Navigate = useNavigate();

  const { getTokens } = useAuth();

  const AppsFetcher = FetchOAuthApps<Array<IOAuthApp>>(getTokens);

  const QueryClient = useQueryClient();

  const ItemsLimit = 100;
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<
    Awaited<ReturnType<typeof AppsFetcher>>,
    Error | AxiosError
  >(
    "oauth-all-apps",
    (ctx) =>
      AppsFetcher({
        limit: ItemsLimit,
        offset: ctx.pageParam,
      }),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.data.length < ItemsLimit ? undefined : pages.length,
    }
  );

  const AppList = React.useMemo(
    () => (data ? data.pages.flatMap((_) => _.data) : []),
    [data]
  );

  const DeleteAppDialogRef = React.createRef<ICustomDialogRef>();

  return (
    <>
      <LinearProgress sx={{ opacity: isFetching ? 1 : 0 }} />
      <HeaderPartial label="OAuth Apps" />
      <Box sx={{ width: "100%", height: "calc(100vh - 70px)" }}>
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
              href="/oauth"
              onClick={(e) => {
                e.preventDefault();
                Navigate(e.currentTarget.getAttribute("href")!);
              }}
            >
              OAuth
            </Link>
            <Typography color="text.primary">All Apps</Typography>
          </Breadcrumbs>
          <Box sx={{ marginY: 2, height: "calc(100% - 50px)" }}>
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
                <Button
                  onClick={() => Navigate("/oauth/apps/new")}
                  variant="contained"
                  size="small"
                >
                  Create New App
                </Button>
              </Box>
            </Box>
            {["loading", "error"].includes(status) ? (
              <EmptyPartial
                isLoading={status === "loading"}
                isError={status === "error"}
                message={error?.message}
                onRefresh={() => refetch()}
              />
            ) : (
              <Virtualizer
                containerProps={{
                  style: {
                    marginTop: "10px",
                    height: "calc(100% - 65px)",
                  },
                }}
                count={AppList.length}
                elementHeightPx={60}
                element={({ index, topPx, heightPx }) => {
                  const App = AppList[index];

                  return (
                    <div
                      key={App._id}
                      style={{
                        width: "100%",
                        height: `${heightPx}px`,
                        position: "absolute",
                        top: `${topPx}px`,
                        left: 0,
                      }}
                    >
                      <AppItem
                        appId={App._id}
                        name={App.name}
                        description={App.description}
                        onDelete={async (_, props) => {
                          if (
                            await DeleteAppDialogRef.current?.confirm({
                              title: "Are you sure?",
                              description: `You are about the delete the app '${App.name}'! Do you want to continue?`,
                            })
                          ) {
                            await DeleteOAuthApp(getTokens)(props.appId).catch(
                              (error) => new Notification(error.message)
                            );
                            await QueryClient.invalidateQueries(
                              "oauth-all-apps"
                            );
                          }
                        }}
                      />
                    </div>
                  );
                }}
                disableOutro={AppList.length < ItemsLimit}
                outroElement={({ isLoading }) => (
                  <div style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <EmptyIndicator
                      message={error?.message ?? "You reach the end!"}
                      isLoading={isLoading}
                      isError={!!error?.message}
                      emptyIconId="golf_course"
                    />
                  </div>
                )}
                isLoading={isFetchingNextPage}
                hasMore={hasNextPage}
                onLoadMore={fetchNextPage}
              />
            )}
          </Box>
        </Box>
      </Box>
      <CustomDialog id="delete-plugin" ref={DeleteAppDialogRef} />
    </>
  );
};
