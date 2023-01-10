import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";

export const LoadingFormPage = () => (
  <Box sx={{ width: "100%", height: "100vh" }}>
    <LinearProgress />
    <Box sx={{ maxWidth: 333, marginX: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </Box>
      <Box sx={{ marginY: 3, paddingX: 3 }}>
        <Typography component="div" variant="body1" sx={{ paddingX: 5 }}>
          <Skeleton />
        </Typography>
        <Typography component="div" variant="h3">
          <Skeleton />
        </Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{ width: 100, marginLeft: "auto" }}
        >
          <Skeleton />
        </Typography>
        <Typography component="div" variant="h3">
          <Skeleton />
        </Typography>
        <Typography component="div" variant="body1" sx={{ width: 120 }}>
          <Skeleton />
        </Typography>
        <Typography component="div" variant="h3">
          <Skeleton />
        </Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{ width: 130, marginLeft: "auto" }}
        >
          <Skeleton />
        </Typography>
      </Box>
      <Box sx={{ marginY: 3, paddingX: 3 }}>
        <Divider sx={{ width: "100%" }}>
          <Typography variant="subtitle2">
            <Skeleton width={100} />
          </Typography>
        </Divider>
      </Box>
      <Box sx={{ marginY: 3, paddingX: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle2">
              <Skeleton width={80} />
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle2">
              <Skeleton width={80} />
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle2">
              <Skeleton width={80} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginY: 3, paddingX: 3 }}>
        <Typography component="div" variant="body1">
          <Skeleton />
        </Typography>
      </Box>
    </Box>
  </Box>
);
