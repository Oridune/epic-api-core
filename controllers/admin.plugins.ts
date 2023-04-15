import {
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
import Manager from "@Core/common/manager.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { addPlugin, PluginSource } from "@Core/scripts/addPlugin.ts";
import { removePlugin } from "@Core/scripts/removePlugin.ts";

@Controller("/plugins/", {
  name: "adminPlugins",

  /** Do not edit this code */
  childs: () => Manager.getModules("controllers", import.meta.url),
  /** --------------------- */
})
export default class AdminPluginsController extends BaseController {
  @Get("/")
  async list() {
    return Response.data(await Manager.getPlugins());
  }

  @Post("/")
  async add(ctx: IRequestContext<RouterContext<string>>) {
    if (Env.is(EnvType.PRODUCTION))
      e.error("This operation is not possible in production!");

    // Body Validation
    const Body = await e
      .object({
        source: e.optional(e.in(Object.values(PluginSource))),
        name: e.string(),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "Plugins.body",
      });

    await e.try(() => addPlugin(Body));

    return Response.data(
      (await Manager.getPlugins()).filter(
        (manager) => manager.name === Body.name
      )[0]
    );
  }

  @Patch("/toggle/enable/")
  async toggleEnable(ctx: IRequestContext<RouterContext<string>>) {
    if (Env.is(EnvType.PRODUCTION))
      e.error("This operation is not possible in production!");

    // Body Validation
    const Body = await e
      .object({
        name: e.string(),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "Plugins.body",
      });

    const Sequence = await Manager.getDetailedSequence("plugins");
    const TargetPlugin = Sequence.filter(({ name }) => name === Body.name)[0];

    if (!TargetPlugin) e.error("Plugin not found!");

    await Manager.setExcludes("plugins", (exc) => {
      if (TargetPlugin.enabled) exc.add(Body.name);
      else exc.delete(Body.name);
      return exc;
    });

    return Response.data({
      name: TargetPlugin.name,
      enabled: !TargetPlugin.enabled,
    });
  }

  @Delete("/:name/")
  async delete(ctx: IRequestContext<RouterContext<string>>) {
    if (Env.is(EnvType.PRODUCTION))
      e.error("This operation is not possible in production!");

    // Params Validation
    const Params = await e
      .object({
        name: e.string(),
      })
      .validate(ctx.router.params, {
        name: "Plugins.params",
      });

    await e.try(() => removePlugin(Params));

    return Response.status(true);
  }
}
