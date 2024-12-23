import { Application } from "oak/application";
import { EventChannel, Events } from "@Core/common/events.ts";
import { Env, prepareFetch } from "@Core/common/mod.ts";

export default (app: Application) => {
  const handle = prepareFetch({ app });

  Events.listen(
    EventChannel.CUSTOM,
    "response",
    async ({ detail: { ctx, res, err } }) => {
      // Log error cases
      const LogEndpoint = "/api/request/logs/";

      if (
        await Env.enabled("REQUEST_LOG_ENABLED") &&
        res.getStatusCode() >= 400 &&
        !(ctx.request.method.toLowerCase() === "post" &&
          LogEndpoint.replace(/^\/|\/$/g, "") ===
            ctx.request.url.pathname.replace(/^\/|\/$/g, ""))
      ) {
        const HostUrl = await Env.get("REQUEST_LOG_HOST");
        const Url = new URL(
          LogEndpoint,
          HostUrl || ctx.request.url.origin,
        );

        const ApiKey = await Env.get("REQUEST_LOG_API_KEY");

        const { user: _, account: __, ...auth } = ctx.state.auth ?? {};

        await (HostUrl ? fetch : handle)(Url, {
          method: "POST",
          headers: {
            Authorization: `ApiKey ${ApiKey}`,
          },
          body: JSON.stringify({
            namespace: await Env.get("APP_NAME"),
            requestId: ctx.state._requestId,
            method: ctx.request.method.toLowerCase(),
            url: ctx.request.url.toString(),
            headers: Object.fromEntries(
              ctx.request.headers.entries(),
            ),
            body: ctx.state._body,
            auth,
            responseStatus: res.getStatusCode(),
            response: res.getBody(),
            errorStack: err instanceof Error ? err.stack : err,
          }),
        }).catch(console.error);
      }
    },
  );
};
