import { basename } from "path";
import {
  Controller,
  BaseController,
  Patch,
  Response,
  type IRequestContext,
  Env,
  EnvType,
} from "@Core/common/mod.ts";
import Manager from "@Core/common/manager.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { updateCore } from "@Core/scripts/updateCore.ts";

@Controller("/admin/", {
  group: "Admin",
  name: "admin",

  /** Do not edit this code */
  childs: () => Manager.getModules("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class AdminController extends BaseController {
  @Patch("/core/")
  async updateCore(ctx: IRequestContext<RouterContext<string>>) {
    if (Env.is(EnvType.PRODUCTION))
      e.error("This operation is not possible in production!");

    // Body Validation
    const Body = await e
      .object({
        branch: e.optional(e.string()),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "admin.body",
      });

    await e.try(() => updateCore(Body));

    return Response.status(true);
  }
}
