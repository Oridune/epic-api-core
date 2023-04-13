import React from "react";
import { Box, Icon, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "@mui/lab/LoadingButton";

export interface IEmptyIndicatorProps {
  message?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: (
    this: HTMLButtonElement,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<any>;
  emptyIconId?: string;
  errorIconId?: string;
}

export const EmptyIndicator: React.FC<IEmptyIndicatorProps> = ({
  message,
  isLoading,
  isError,
  onRefresh,
  emptyIconId,
  errorIconId,
}) => {
  const [Loading, setLoading] = React.useState(false);

  return (
    <>
      {isLoading ? (
        <Box textAlign="center">
          <CircularProgress size={20} />
          <Typography variant="body2" color="GrayText" sx={{ marginY: 1 }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Box textAlign="center">
          <Icon>
            {isError ? errorIconId ?? "error" : emptyIconId ?? "inbox"}
          </Icon>
          <Typography variant="body2" color="GrayText" sx={{ marginY: 1 }}>
            {message ?? "Nothing to show here!"}
          </Typography>
          {typeof onRefresh === "function" && (
            <LoadingButton
              size="small"
              loading={Loading}
              onClick={async function (this: any, e) {
                setLoading(true);

                try {
                  await onRefresh.bind(this)(e);
                } catch (e) {
                  console.error(e);
                }

                setLoading(false);
              }}
            >
              Refresh
            </LoadingButton>
          )}
        </Box>
      )}
    </>
  );
};

export interface IEmptyPartialProps extends IEmptyIndicatorProps {}

export const EmptyPartial: React.FC<IEmptyPartialProps> = (props) => (
  <Box
    sx={{
      width: "100%",
      height: "calc(100% - 80px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <EmptyIndicator {...props} />
  </Box>
);
