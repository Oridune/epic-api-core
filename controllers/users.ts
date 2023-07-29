import {
  Env,
  Controller,
  BaseController,
  Get,
  Post,
  Response,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import mongoose from "mongoose";

import { Gender, IUser, UserModel } from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountModel } from "@Models/account.ts";
import { IOauthApp, OauthAppModel } from "@Models/oauth-app.ts";

export const UsernameValidator = () =>
  e.string().matches({
    regex: /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
  });

export const PasswordValidator = () =>
  e.string().matches({
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/,
  });

export const EmailValidator = () =>
  e.string().matches({
    regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
  });

export const PhoneValidator = () =>
  e.string().matches({
    regex: /^\+(?:[0-9]?){6,14}[0-9]$/,
  });

@Controller("/users/", { group: "Users", name: "users" })
export default class UsersController extends BaseController {
  static async create(user: Partial<IUser>) {
    const Session = await mongoose.startSession();

    try {
      Session.startTransaction();

      const User = new UserModel(user);
      const Account = new AccountModel({});
      const Collaborator = new CollaboratorModel({
        account: Account,
        isOwned: true,
        isPrimary: true,
        role: ["", undefined].includes(
          await Env.get("VERIFIED_ROLE_POLICY", true)
        )
          ? "user"
          : "unverified",
      });

      User.collaborates = [Collaborator];
      Account.createdBy = Account.createdFor = User;
      Collaborator.createdBy = Collaborator.createdFor = User;

      await Account.save({ session: Session });
      await Collaborator.save({ session: Session });
      await User.save({ session: Session });

      await Session.commitTransaction();

      return User;
    } catch (error) {
      await Session.abortTransaction();
      throw error;
    }
  }

  @Post("/:oauthAppId/")
  public create() {
    // Define Params Schema
    const ParamsSchema = e.object({
      oauthAppId: e.string().throwsFatal(),
      oauthApp: e.any().custom(async (ctx) => {
        const App = await OauthAppModel.findOne({
          _id: ctx.parent!.output.oauthAppId,
        });

        if (!App) throw new Error(`Invalid oauth app id!`);
        return App;
      }),
    });

    // Define Body Schema
    const BodySchema = e.object({
      oauthApp: e.any().custom((ctx) => ctx.context.oauthApp as IOauthApp),
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
      email: e.optional(EmailValidator()),
      phone: e.optional(PhoneValidator()),
    });

    return {
      postman: {
        params: ParamsSchema.toSample().data,
        body: BodySchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "users.params",
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          {
            name: "users.body",
            context: {
              oauthApp: Params.oauthApp,
            },
          }
        );

        const User = await UsersController.create(Body);

        User.set("password", undefined);
        User.set("oauthApp", undefined);
        User.set("collaborates", undefined);

        return Response.statusCode(Status.Created).data(User);
      },
    };
  }

  @Get("/:oauthAppId/")
  public list() {
    // Define Query Schema
    const QuerySchema = e.object({}, { allowUnexpectedProps: true });

    // Define Params Schema
    const ParamsSchema = e.object({});

    return {
      postman: {
        query: QuerySchema.toSample().data,
        params: ParamsSchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: "users.query" }
        );

        /**
         * It is recommended to keep the following validators in place even if you don't want to validate any data.
         * It will prevent the client from injecting unexpected data into the request.
         *
         * */

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "users.params",
        });

        // Start coding here...

        return Response.status(true);
      },
    };
  }
}
