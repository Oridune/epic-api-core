import { basename } from "path";
import {
  Controller,
  BaseController,
  Manager,
  Get,
  Post,
  Response,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";

import { UserModel } from "@Models/User.ts";

@Controller("/users/", {
  /** Do not edit this code */
  childs: await Manager.load("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class UsersController extends BaseController {
  @Post("/")
  async CreateUsers(ctx: IRequestContext<RouterContext<string>>) {
    // Query Validation
    const Query = await e
      .object({}, { allowUnexpectedProps: true })
      .validate(ctx.router.request.url.searchParams, { name: "users.query" });

    /**
     * It is recommended to keep the following validators in place even if you don't want to validate any data.
     * It will prevent the client from injecting unexpected data into the request.
     *
     * */

    // Body Validation
    const Body = await e
      .object({
        fname: e.string(),
        mname: e.optional(e.string()),
        lname: e.optional(e.string()),
        username: e.string(),
        password: e
          .string({ throwsFatal: true })
          .custom((ctx) =>
            bcrypt.hash(ctx.output + ctx.parent!.output.username)
          ),
        tags: e.optional(e.array(e.string())),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "users.body",
      });

    return Response.statusCode(Status.Created).data(
      (await new UserModel(Body).save()).set("password", undefined)
    );
  }

  @Get("/")
  async GetUsers(ctx: IRequestContext<RouterContext<string>>) {
    // Query Validation
    const Query = await e
      .object({}, { allowUnexpectedProps: true })
      .validate(ctx.router.request.url.searchParams, { name: "users.query" });

    /**
     * It is recommended to keep the following validators in place even if you don't want to validate any data.
     * It will prevent the client from injecting unexpected data into the request.
     *
     * */

    // Params Validation
    const Params = await e
      .object({})
      .validate(ctx.router.params, { name: "users.params" });

    return Response.data(await UserModel.find());
  }
}
