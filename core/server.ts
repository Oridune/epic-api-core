// deno-lint-ignore-file no-explicit-any
import {
  Env,
  EnvType,
  Events,
  fetch as customFetch,
  Loader,
  RawResponse,
  Response,
  Server,
  Store,
} from "@Core/common/mod.ts";
import { APIController } from "@Core/controller.ts";
import { Database } from "@Database";
import { Application as AppServer, Router as AppRouter, Status } from "oak";
import { join } from "path";
import { ApplicationListenEvent } from "oak/application.ts";
import Logger from "oak:logger";
import { CORS } from "oak:cors";
import { gzip } from "oak:compress";
import { responseTime } from "@Core/middlewares/responseTime.ts";
import { errorHandler, respondWith } from "@Core/middlewares/errorHandler.ts";
import { serveStatic } from "@Core/middlewares/serveStatic.ts";
import { requestId } from "@Core/middlewares/requestId.ts";
import { rateLimiter } from "@Core/middlewares/rateLimiter.ts";

export const prepareAppServer = async () => {
  const App = new AppServer();
  const Router = new AppRouter();

  App.use(responseTime());

  if (!Env.is(EnvType.PRODUCTION)) {
    App.use(Logger.logger);
  }

  App.use(errorHandler());
  App.use(gzip());
  App.use(CORS());
  App.use(
    rateLimiter({
      limit: await Env.get("RATE_LIMITER_LIMIT", true),
      windowMs: await Env.get("RATE_LIMITER_WINDOW_MS", true),
    }),
  );
  App.use(requestId());

  const UITableData: Array<{
    Type: string;
    UI: string;
    Endpoint: string;
    Root: string;
  }> = [];

  const ServeStatic = (details: { name: string; path: string }) => {
    const Root = join(details.path, "www");

    UITableData.push({
      Type: "Static",
      UI: details.name.toUpperCase(),
      Endpoint: `/${details.name}/`,
      Root: Root.replace(Deno.cwd(), "").replace(/\\/g, "/"),
    });

    App.use(serveStatic(details.name, Root));
  };

  for (const [, SubLoader] of Loader.getLoaders() ?? []) {
    for (
      const [, UI] of SubLoader.tree
        .get("public")
        ?.sequence.listDetailed() ?? []
    ) {
      if (UI.enabled) ServeStatic(UI);
    }
  }

  for (const [, UI] of Loader.getSequence("public")?.listDetailed() ?? []) {
    if (UI.enabled) ServeStatic(UI);
  }

  // Log UI list
  if (UITableData.length) console.table(UITableData);

  for (const [, SubLoader] of Loader.getLoaders() ?? []) {
    for (
      const [, Middleware] of SubLoader.tree.get("middlewares")?.modules ??
        []
    ) {
      if (typeof Middleware.object.default === "function") {
        App.use(await Middleware.object.default());
      }
    }
  }

  for (const [, Middleware] of Loader.getModules("middlewares") ?? []) {
    if (typeof Middleware.object.default === "function") {
      App.use(await Middleware.object.default());
    }
  }

  await new Server(APIController).prepare(async (routes) => {
    const Hooks: Array<{
      pre?: (...args: any[]) => Promise<void>;
      post?: (...args: any[]) => Promise<void>;
    }> = [];

    for (const [, SubLoader] of Loader.getLoaders() ?? []) {
      for (const [, Hook] of SubLoader.tree.get("hooks")?.modules ?? []) {
        if (typeof Hook.object.default === "object") {
          Hooks.push(Hook.object.default);
        }
      }
    }

    for (const [, Hook] of Loader.getModules("hooks") ?? []) {
      if (typeof Hook.object.default === "object") {
        Hooks.push(Hook.object.default);
      }
    }

    const RoutesTableData: Array<{
      Type: string;
      Method: string;
      Permission: string;
      Endpoint: string;
    }> = [];

    for (const Route of routes) {
      RoutesTableData.push({
        Type: "Endpoint",
        Method: Route.options.method.toUpperCase(),
        Permission: `${Route.scope}.${Route.options.name}`,
        Endpoint: Route.endpoint,
      });

      const ControllerOptions = Route.options.controller.getOptions();
      const Middlewares = [
        ...(typeof ControllerOptions?.middlewares === "function"
          ? await ControllerOptions.middlewares()
          : ControllerOptions?.middlewares ?? []),

        ...(typeof Route.options.middlewares === "function"
          ? await Route.options.middlewares()
          : Route.options.middlewares ?? []),
      ];

      Router[Route.options.method as "get"](
        Route.endpoint,
        async (ctx, next) => {
          ctx.state.requestId = ctx.state["X-Request-ID"];
          ctx.state.requestName = Route.options.name;

          await next();
        },
        ...Middlewares,
        async (ctx) => {
          const TargetVersion = ctx.request.headers.get("x-app-version") ??
            "latest";
          const RequestContext = {
            requestedVersion: TargetVersion,
            version: TargetVersion,
            id: ctx.state.requestId,
            router: ctx,
            options: Route.options,
          };

          for (const Hook of Hooks) {
            await Hook.pre?.(Route.scope, Route.options.name, RequestContext);
          }

          const { version, object: RequestHandler } =
            (await Route.options.buildRequestHandler(Route, {
              version: RequestContext.version,
            })) ?? {};

          RequestContext.version = version ?? RequestContext.version;

          ctx.state._handleStartedAt = Date.now();

          const ReturnedResponse = await RequestHandler?.handler.bind(
            RequestHandler,
          )(RequestContext);

          if (ReturnedResponse instanceof Response) {
            ReturnedResponse.metrics({
              handledInMs: Date.now() - ctx.state._handleStartedAt,
            });
          }

          for (const Hook of Hooks) {
            await Hook?.post?.(Route.scope, Route.options.name, {
              ctx: RequestContext,
              res: ReturnedResponse,
            });
          }

          Events.dispatchRequestEvent(`${Route.scope}.${Route.options.name}`, {
            ctx: RequestContext,
            res: ReturnedResponse,
          });

          if (
            ReturnedResponse instanceof RawResponse ||
            ReturnedResponse instanceof Response
          ) {
            respondWith(ctx, ReturnedResponse);
          }
        },
      );
    }

    // Log routes list
    if (RoutesTableData.length) console.table(RoutesTableData);
  });

  App.use(Router.routes());
  App.use(Router.allowedMethods());
  App.use((ctx) => ctx.throw(Status.NotFound));

  return App;
};

export const startBackgroundJobs = async (app: AppServer) => {
  const Jobs: Array<(app: AppServer) => Promise<() => Promise<void>>> = [];

  for (const [, SubLoader] of Loader.getLoaders() ?? []) {
    for (const [, Job] of SubLoader.tree.get("jobs")?.modules ?? []) {
      if (typeof Job.object.default === "function") {
        Jobs.push(Job.object.default);
      }
    }
  }

  for (const [, Job] of Loader.getModules("jobs") ?? []) {
    if (typeof Job.object.default === "function") Jobs.push(Job.object.default);
  }

  return (await Promise.all(Jobs.map((_) => _(app)))).filter(
    (_) => typeof _ === "function",
  );
};

export const createAppServer = async () => {
  const App = await prepareAppServer();

  const Context = { jobCleanups: [] as Array<() => any> };

  let AbortControllerObject: AbortController | undefined;

  const StartServer = () =>
    new Promise<ApplicationListenEvent>((resolve) => {
      (async () => {
        await Store.connect();
        await Database.connect();

        Context.jobCleanups = await startBackgroundJobs(App);

        AbortControllerObject = new AbortController();

        App.listen({
          port: parseInt(Env.getSync("PORT", true) || "8080"),
          signal: AbortControllerObject.signal,
        });

        const listenHandler = (e: ApplicationListenEvent) => {
          console.info(
            `${Env.getType().toUpperCase()} Server is listening on Port: ${e.port}`,
          );

          App.removeEventListener("listen", listenHandler as any);

          resolve(e);
        };

        App.addEventListener("listen", listenHandler);
      })();
    });

  const EndServer = async () => {
    AbortControllerObject?.abort();

    try {
      await Promise.all(Context.jobCleanups.map((_) => _()));
      await Database.disconnect();
      await Store.disconnect();
    } catch (error) {
      console.error(error);
    }

    console.info("Server terminated successfully!");
  };

  const RestartServer = async () => {
    console.info("Restarting Server...");

    await EndServer();

    return await StartServer();
  };

  return {
    app: App,
    fetch: (
      ...params: Parameters<typeof customFetch> extends [infer _, ...infer R]
        ? R
        : never
    ) => customFetch(App, params[0], params[1]),
    start: StartServer,
    end: EndServer,
    restart: RestartServer,
  };
};
