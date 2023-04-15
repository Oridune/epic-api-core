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

import { Gender, IUser, UserModel } from "@Models/user.ts";
import { AccessModel } from "@Models/access.ts";
import { AccountModel } from "@Models/account.ts";
import { OauthAppModel } from "@Models/oauth-app.ts";

export const UsernameValidator = () =>
  e.string().matches({
    regex: /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
  });

export const PasswordValidator = () =>
  e.string().matches({
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/,
  });

@Controller("/users/", {
  name: "users",

  /** Do not edit this code */
  childs: await Manager.getModules("controllers", basename(import.meta.url)),
  /** --------------------- */
})
export default class UsersController extends BaseController {
  static async create(user: Partial<IUser>) {
    const Session = await mongoose.startSession();

    try {
      Session.startTransaction();

      const User = new UserModel(user);
      const Account = new AccountModel({});
      const Access = new AccessModel({
        account: Account,
        isOwned: true,
        isPrimary: true,
        role: "user",
      });

      User.accesses = [Access];
      Account.createdBy = Account.createdFor = User;
      Access.createdBy = Access.createdFor = User;

      await Account.save({ session: Session });
      await Access.save({ session: Session });
      await User.save({ session: Session });

      await Session.commitTransaction();

      return User;
    } catch (error) {
      await Session.abortTransaction();
      throw error;
    }
  }

  @Post("/:oauthAppId/")
  async create(ctx: IRequestContext<RouterContext<string>>) {
    // Params Validation
    const Params = await e
      .object({
        oauthAppId: e.string().throwsFatal(),
        oauthApp: e.any().custom(async (ctx) => {
          const App = await OauthAppModel.findOne({
            _id: ctx.parent!.output.oauthAppId,
          });

          if (!App) throw new Error(`Invalid oauth app id!`);
          return App;
        }),
      })
      .validate(ctx.router.params, { name: "users.params" });

    // Body Validation
    const Body = await e
      .object({
        oauthApp: e.value(Params.oauthApp),
        fname: e.string(),
        mname: e.optional(e.string()),
        lname: e.optional(e.string()),
        username: UsernameValidator().custom(async (ctx) => {
          if (await UserModel.exists({ username: ctx.output }))
            throw "User already exists!";
        }),
        password: PasswordValidator(),
        gender: e.optional(e.in(Object.values(Gender))),
        dob: e.optional(
          e.number({ cast: true }).custom((ctx) => new Date(ctx.output))
        ),
        locale: e.optional(e.string()),
        tags: e.optional(e.array(e.string())),
      })
      .validate(await ctx.router.request.body({ type: "json" }).value, {
        name: "users.body",
      });

    const User = await UsersController.create(Body);

    User.set("password", undefined);
    User.set("oauthApp", undefined);
    User.set("accesses", undefined);

    return Response.statusCode(Status.Created).data(User);
  }

  @Get("/:oauthAppId/")
  async list(ctx: IRequestContext<RouterContext<string>>) {
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
