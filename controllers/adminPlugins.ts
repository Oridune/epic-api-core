import {
  Loader,
  Controller,
  BaseController,
  Get,
  Post,
  Patch,
  Delete,
  Response,
  type IRequestContext,
  Env,
  EnvType,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import { addPlugin, PluginSource } from "@Core/scripts/addPlugin.ts";
import { removePlugin } from "@Core/scripts/removePlugin.ts";

@Controller("/admin/plugins/", { group: "Admin", name: "adminPlugins" })
export default class AdminPluginsController extends BaseController {
  @Get("/")
  public list() {
    return {
      handler: () =>
        Response.data(Loader.getSequence("plugins")?.listDetailed() ?? []),
    };
  }

  @Post("/")
  public add() {
    // Define Body Schema
    const BodySchema = e.object({
      source: e.optional(e.in(Object.values(PluginSource))),
      name: e.string(),
    });

    return {
      postman: {
        body: BodySchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (Env.is(EnvType.PRODUCTION))
          e.error("This operation is not possible in production!");

        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "Plugins.body" }
        );

        await e.try(() => addPlugin(Body));

        return Response.statusCode(Status.Created);
      },
    };
  }

  @Patch("/toggle/plugin/")
  public toggleEnable() {
    // Define Body Schema
    const BodySchema = e.object({
      name: e.string(),
    });

    return {
      postman: {
        body: BodySchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (Env.is(EnvType.PRODUCTION))
          e.error("This operation is not possible in production!");

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "Plugins.body" }
        );

        // Toggle Plugin
        Loader.getSequence("plugins")?.toggle(Body.name);

        return Response.true();
      },
    };
  }

  @Delete("/:name/")
  public delete() {
    // Define Params Schema
    const ParamsSchema = e.object({
      name: e.string(),
    });

    return {
      postman: {
        params: ParamsSchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (Env.is(EnvType.PRODUCTION))
          e.error("This operation is not possible in production!");

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "Plugins.params",
        });

        await e.try(() => removePlugin(Params));

        return Response.status(true);
      },
    };
  }
}
