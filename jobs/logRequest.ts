import { Application } from "oak/application";
import { EventChannel, Events } from "@Core/common/events.ts";
import { Env, EnvType, prepareFetch } from "@Core/common/mod.ts";
import { getMemoryUsageDetails } from "@Core/common/memoryUtils.ts";

// Timeout for log requests to prevent hanging promises
const LOG_REQUEST_TIMEOUT_MS = 5000;

export default (app: Application) => {
  const handle = prepareFetch({ app });

  Events.listen(
    EventChannel.CUSTOM,
    "response",
    // Note: Using non-async function to avoid holding references while awaiting
    ({ detail: { ctx, res, err } }) => {
      // Log error cases
      const LogEndpoint = "/api/request/logs/";

      // Check conditions synchronously where possible
      if (Env.is(EnvType.TEST)) return;

      const method = ctx.request.method.toLowerCase();
      const pathname = ctx.request.url.pathname.replace(/^\/|\/$/g, "");
      const statusCode = res.getStatusCode();

      if (
        statusCode < 200 ||
        (method === "post" &&
          LogEndpoint.replace(/^\/|\/$/g, "") === pathname)
      ) {
        return;
      }

      // Extract all needed data upfront to avoid holding ctx/res references
      const logData = {
        requestId: ctx.state._requestId,
        method,
        url: ctx.request.url.toString(),
        headers: Object.fromEntries(ctx.request.headers.entries()),
        body: ctx.state._body,
        auth: (() => {
          const { user: _, account: __, ...auth } = ctx.state.auth ?? {};
          return auth;
        })(),
        responseStatus: statusCode,
        response: res.getBody(),
        errorStack: err instanceof Error ? err.stack : err,
        memoryUsageDetails: getMemoryUsageDetails({
          project: {
            baseDiffMb: 1,
            diffMb: 1,
            heapPercentage: 1,
            rssPercentage: 1,
            usageMb: 1,
          },
        }),
        origin: ctx.request.url.origin,
      };

      // Fire-and-forget async logging with timeout
      (async () => {
        try {
          if (!await Env.enabled("REQUEST_LOG_ENABLED")) return;

          const HostUrl = await Env.get("REQUEST_LOG_HOST", true);
          const Url = new URL(
            LogEndpoint,
            HostUrl || logData.origin,
          );

          const ApiKey = await Env.get("REQUEST_LOG_API_KEY", true);
          const namespace = await Env.get("APP_NAME", true);

          // Create abort controller with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            LOG_REQUEST_TIMEOUT_MS,
          );

          try {
            await (HostUrl ? fetch : handle)(Url, {
              method: "POST",
              headers: {
                Authorization: ApiKey
                  ? `ApiKey ${ApiKey}`
                  : `Bypass ${await Env.get("ENCRYPTION_KEY")}`,
              },
              body: JSON.stringify({
                namespace,
                requestId: logData.requestId,
                method: logData.method,
                url: logData.url,
                headers: logData.headers,
                body: logData.body,
                auth: logData.auth,
                responseStatus: logData.responseStatus,
                response: logData.response,
                errorStack: logData.errorStack,
                memoryUsageDetails: logData.memoryUsageDetails,
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeoutId);
          }
        } catch {
          // Silently ignore logging failures to prevent memory buildup
        }
      })();
    },
  );
};
