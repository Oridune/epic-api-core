import { basename } from "path";
import {
  Controller,
  BaseController,
  Get,
  Response,
  type IRequestContext,
} from "@Core/common/mod.ts";
import Manager from "@Core/common/manager.ts";
import { type RouterContext } from "oak";

@Controller("/plugins/", {
  /** Do not edit this code */
  childs: await Manager.getModules("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class PluginsController extends BaseController {
  @Get("/")
  async GetPlugins() {
    return Response.data(await Manager.getPlugins());
  }
}
