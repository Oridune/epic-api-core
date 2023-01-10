import { Box, Breadcrumbs, Grid, Link, Typography, Icon } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { HeaderPartial } from "../partials/Header";

export interface IPluginItemProps {
  title: string;
  description: string;
  logo?: string;
  enabled?: boolean;
  loading?: boolean;
}

export const PluginItem: React.FC<IPluginItemProps> = ({
  title,
  description,
  logo,
  enabled,
  loading,
}) => {
  return (
    <Grid item md={3}>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.2, delay: 0.1 },
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        style={{ cursor: "pointer" }}
      >
        <Box bgcolor={grey["50"]} borderRadius={2} padding={1}>
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
                borderRadius={2}
                width="25px"
                height="25px"
                sx={{
                  backgroundImage: logo ? `url(${logo})` : undefined,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {!logo && (
                  <Icon sx={{ color: "gray" }}>electrical_services</Icon>
                )}
              </Box>
              <Box>
                {!enabled ? (
                  <LoadingButton
                    variant="text"
                    size="small"
                    color="success"
                    loading={loading}
                  >
                    Enable
                  </LoadingButton>
                ) : (
                  <LoadingButton variant="text" size="small" color="error">
                    Disable
                  </LoadingButton>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="div" marginTop={1}>
                {title}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="grey"
                marginTop={1}
              >
                {description}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Grid>
  );
};

export const PluginsPage = () => {
  const Navigate = useNavigate();

  return (
    <>
      <HeaderPartial label="Plugins" />
      <Box sx={{ width: "100%", height: "calc(100vh - 60px)" }}>
        <Box sx={{ paddingX: 2, maxWidth: "72rem", marginX: "auto" }}>
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
          <Box sx={{ marginY: 2 }}>
            <Grid container spacing={1}>
              <PluginItem
                title="Core"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                enabled
              />
              <PluginItem
                title="E-Commerce"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                enabled
              />
              <PluginItem
                title="GraphQL"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
              />
              <PluginItem
                title="AWS S3"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                enabled
              />
              <PluginItem
                title="Stripe"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                logo="https://cdn.brandfolder.io/KGT2DTA4/at/8vbr8k4mr5xjwk4hxq4t9vs/Stripe_wordmark_-_blurple.svg"
                loading
              />
              <PluginItem
                title="Bookings"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                enabled
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};
