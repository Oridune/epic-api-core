import {
  Controller,
  BaseController,
  Patch,
  Response,
  type IRequestContext,
  Env,
  EnvType,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { updateCore } from "@Core/scripts/updateCore.ts";

@Controller("/admin/", { group: "Admin", name: "admin" })
export default class AdminController extends BaseController {
  @Patch("/core/")
  public updateCore() {
    // Define Body Schema
    const BodySchema = e.object({
      branch: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
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
    });
  }
}
