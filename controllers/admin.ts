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
  childs: () => Manager.getModules("controllers", import.meta.url),
  /** --------------------- */
})
export default class AdminController extends BaseController {
  @Patch("/core/")
  public updateCore() {
    // Define Body Schema
    const BodySchema = e.object({
      branch: e.optional(e.string()),
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
          { name: "admin.body" }
        );

        await e.try(() => updateCore(Body));

        return Response.status(true);
      },
    };
  }
}
