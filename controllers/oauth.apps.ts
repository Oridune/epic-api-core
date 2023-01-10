import { basename } from "path";
import {
  Controller,
  BaseController,
  Get,
  Post,
  Response,
  type IRequestContext,
} from "@Core/common/mod.ts";
import Manager from "@Core/common/manager.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import mongoose from "mongoose";

import { OauthAppModel } from "@Models/oauth-app.ts";

@Controller("/apps/", {
  /** Do not edit this code */
  childs: await Manager.getModules("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class AppsController extends BaseController {
  @Post("/")
  async CreateApp(ctx: IRequestContext<RouterContext<string>>) {
    // Query Validation
    const Query = await e
      .object({}, { allowUnexpectedProps: true })
      .validate(Object.fromEntries(ctx.router.request.url.searchParams), {
        name: "Apps.query",
      });

    /**
     * It is recommended to keep the following validators in place even if you don't want to validate any data.
     * It will prevent the client from injecting unexpected data into the request.
     *
     * */

    // Params Validation
    const Params = await e
      .object({})
      .validate(ctx.router.params, { name: "Apps.params" });

    // Body Validation
    const Body = await e
      .object({})
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "Apps.body",
      });

    // Start coding here...

    return Response.statusCode(Status.Created);
  }

  @Get("/default/")
  async GetDefaultApp() {
    const App = await OauthAppModel.findOne({ name: "default" });
    if (!App) e.error("Oauth app not found!");
    return Response.data(App!);
  }

  @Get("/:appId/")
  async GetApp(ctx: IRequestContext<RouterContext<string>>) {
    // Params Validation
    const Params = await e
      .object({
        appId: e.string().custom((ctx) => {
          if (!mongoose.Types.ObjectId.isValid(ctx.output))
            throw "Not a valid id!";
        }),
      })
      .validate(ctx.router.params, { name: "Apps.params" });

    const App = await OauthAppModel.findOne({ _id: Params.appId });
    if (!App) e.error("Oauth app not found!");
    return Response.data(App!);
  }
}
