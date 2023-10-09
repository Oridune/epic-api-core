import {
  Env,
  Controller,
  BaseController,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Response,
  type IRequestContext,
  type IRoute,
  Versioned,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";

import { Gender, IUser, UserModel } from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountModel } from "@Models/account.ts";
import { IOauthApp, OauthAppModel } from "@Models/oauth-app.ts";
import { OauthSessionModel } from "@Models/oauth-session.ts";
import {
  IdentificationMethod,
  IdentificationPurpose,
} from "@Controllers/usersIdentification.ts";
import OauthController from "@Controllers/oauth.ts";
import { PermanentlyDeleteUsers } from "@Jobs/delete-users.ts";
import UploadsController from "@Controllers/uploads.ts";
import { Uploads } from "@Lib/uploads/mod.ts";
import { IFile } from "@Models/file.ts";

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
    regex:
      /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){7,13}\d$/,
  });

@Controller("/users/", { group: "Users", name: "users" })
export default class UsersController extends BaseController {
  static async create(user: Partial<IUser>) {
    const Session = await mongoose.startSession();

    try {
      Session.startTransaction();

      const Password = await bcrypt.hash(
        user.password ?? Math.random().toString(36) + Date.now().toString(36)
      );

      const User = new UserModel({
        ...user,
        password: Password,
      });
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

  static async verify(method: IdentificationMethod, userId: string) {
    switch (method) {
      case IdentificationMethod.EMAIL:
        await UserModel.updateOne({ _id: userId }, { isEmailVerified: true });
        break;

      case IdentificationMethod.PHONE:
        await UserModel.updateOne({ _id: userId }, { isPhoneVerified: true });
        break;

      default:
        throw new Error(`Invalid identification method for verification!`);
    }
  }

  static async scheduleDeletion(
    userId: string,
    options?: { timeoutMs?: number }
  ) {
    await UserModel.updateOne(
      { _id: userId },
      {
        deletionAt:
          Date.now() +
          (options?.timeoutMs ??
            parseFloat(
              (await Env.get("USER_DELETION_TIMEOUT_MS", true)) ?? "1.296e+9" // Deletion in 15 days default
            )),
      }
    );
  }

  @Post("/:oauthAppId/")
  public create(route: IRoute) {
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
      fname: e.string().min(3),
      mname: e.optional(e.string()),
      lname: e.optional(e.string()),
      username: UsernameValidator().custom(async (ctx) => {
        if (await UserModel.exists({ username: ctx.output }))
          throw "Username is already taken!";
      }),
      password: PasswordValidator(),
      passwordHistory: e.any().custom((ctx) => [ctx.parent!.output.password]),
      gender: e.optional(e.in(Object.values(Gender))),
      dob: e.optional(e.date()),
      locale: e.optional(e.string()),
      tags: e.optional(e.array(e.string())),
      email: e.optional(EmailValidator()),
      phone: e.optional(PhoneValidator()),
      country: e.optional(e.string()),
      state: e.optional(e.string()),
      city: e.optional(e.string()),
      address_1: e.optional(e.string()),
      address_2: e.optional(e.string()),
      postalCode: e.optional(e.string()),
    });

    return {
      postman: {
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          {
            name: `${route.scope}.body`,
            context: {
              oauthApp: Params.oauthApp,
            },
          }
        );

        const User = await UsersController.create(Body);

        User.set("password", undefined);
        User.set("passwordHistory", undefined);
        User.set("oauthApp", undefined);
        User.set("collaborates", undefined);

        return Response.statusCode(Status.Created).data(User);
      },
    };
  }

  @Patch("/me/")
  public update(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      fname: e.optional(e.string().min(3), { nullish: true }),
      mname: e.optional(e.string(), { nullish: true }),
      lname: e.optional(e.string(), { nullish: true }),
      gender: e.optional(e.in(Object.values(Gender)), { nullish: true }),
      dob: e.optional(e.date(), { nullish: true }),
      locale: e.optional(e.string(), { nullish: true }),
      tags: e.optional(e.array(e.string()), { nullish: true }),
      country: e.optional(e.string(), { nullish: true }),
      state: e.optional(e.string(), { nullish: true }),
      city: e.optional(e.string(), { nullish: true }),
      address_1: e.optional(e.string(), { nullish: true }),
      address_2: e.optional(e.string(), { nullish: true }),
      postalCode: e.optional(e.string(), { nullish: true }),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        // Update user
        await UserModel.updateOne({ _id: ctx.router.state.auth.userId }, Body);

        return Response.data(Body);
      },
    });
  }

  @Put("/password/")
  public updatePassword(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      method: e.in(Object.values(IdentificationMethod)),
      token: e.string(),
      code: e.number({ cast: true }).length(6),
      password: PasswordValidator(),
      hashedPassword: e
        .any()
        .custom((ctx) => bcrypt.hash(ctx.parent?.output.password)),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        const Payload = (ctx.router.state.verifyTokenPayload =
          await OauthController.verifyToken<{
            method: IdentificationMethod;
            userId: string;
          }>({
            type:
              Body.method + "_identification_" + IdentificationPurpose.RECOVERY,
            token: Body.token,
            secret: Body.code.toString(),
          }).catch(e.error));

        const User = await UserModel.findOne(
          { _id: Payload.userId },
          { passwordHistory: 1 }
        );

        if (!User) e.error(`User not found!`);

        if (
          User!.passwordHistory?.some((hashedPassword) =>
            bcrypt.compareSync(Body.password, hashedPassword)
          )
        )
          e.error(`Cannot use an old password!`);

        await UserModel.updateOne(
          { _id: Payload.userId },
          {
            password: Body.hashedPassword,
            $push: { passwordHistory: Body.hashedPassword },
            isBlocked: false,
          }
        );

        return Response.true();
      },
    });
  }

  @Put("/email/")
  public updateEmail(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      email: EmailValidator().custom(async (ctx) => {
        if (await UserModel.exists({ email: ctx.output }))
          throw "Please provide a different email!";
      }),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        const Verified = false;

        await UserModel.updateOne(
          { _id: ctx.router.state.auth.userId },
          { email: Body.email, isEmailVerified: Verified }
        );

        return Response.data({
          type: IdentificationMethod.EMAIL,
          value: Body.email,
          verified: Verified,
        });
      },
    });
  }

  @Put("/phone/")
  public updatePhone(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      phone: PhoneValidator().custom(async (ctx) => {
        if (await UserModel.exists({ phone: ctx.output }))
          throw "Please provide a different phone!";
      }),
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        const Verified = false;

        await UserModel.updateOne(
          { _id: ctx.router.state.auth.userId },
          { phone: Body.phone, isPhoneVerified: Verified }
        );

        return Response.data({
          type: IdentificationMethod.PHONE,
          value: Body.phone,
          verified: Verified,
        });
      },
    });
  }

  @Post("/verify/")
  public verify(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      method: e.in(Object.values(IdentificationMethod)),
      token: e.string(),
      code: e.number({ cast: true }).length(6),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` }
        );

        const Payload = (ctx.router.state.verifyTokenPayload =
          await OauthController.verifyToken<{
            method: IdentificationMethod;
            userId: string;
          }>({
            type:
              Body.method +
              "_identification_" +
              IdentificationPurpose.VERIFICATION,
            token: Body.token,
            secret: Body.code.toString(),
          }).catch(e.error));

        await UsersController.verify(Payload.method, Payload.userId);

        return Response.true();
      },
    });
  }

  @Get("/:userId?/")
  public listAll(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        limit: e.optional(e.number({ cast: true })).default(Infinity),
        offset: e.optional(e.number({ cast: true })).default(0),
      },
      { allowUnexpectedProps: true }
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      userId: e.optional(e.string()),
    });

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` }
        );

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Fetch users
        const Users = await UserModel.find({ _id: Params.userId })
          .populate({
            path: "collaborates",
            populate: "account",
          })
          .skip(Query.offset)
          .limit(Query.limit);

        return Response.data({
          users: Users,
        });
      },
    });
  }

  @Get("/me/")
  public get() {
    return Versioned.add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Fetch user
        const User = await UserModel.findOne({
          _id: ctx.router.state.auth.userId,
        }).populate({
          path: "collaborates",
          populate: "account",
        });

        return Response.data({
          user: User,
        });
      },
    });
  }

  @Delete("/")
  public delete(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      { deletionTimeoutMs: e.optional(e.number({ cast: true })) },
      { allowUnexpectedProps: true }
    );

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` }
        );

        // Logout all sessions
        await OauthSessionModel.deleteMany({
          createdBy: ctx.router.state.auth.userId,
        });

        await UsersController.scheduleDeletion(ctx.router.state.auth.userId, {
          timeoutMs: Query.deletionTimeoutMs,
        });

        // Instant user deletion
        if (Query.deletionTimeoutMs === 0) await PermanentlyDeleteUsers.exec();

        return Response.true();
      },
    });
  }

  @Get("/avatar/sign/")
  public signAvatar(route: IRoute) {
    return UploadsController.sign(route, {
      allowedContentTypes: [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/svg+xml",
        "image/webp",
      ],
      maxContentLength: 2e6,
      location: "{{userId}}/avatar/",
    });
  }

  @Put("/avatar/")
  public updateAvatar(route: IRoute) {
    // Define Body Schema
    const BodySchema = e
      .object({
        token: e
          .string()
          .custom((ctx) =>
            OauthController.verifyToken<IFile>({
              token: ctx.output,
              type: UploadsController.UploadTokenType,
              secret: ctx.context?.userId,
            })
          )
          .checkpoint(),
      })
      .custom(async (ctx) => {
        if (!(await Uploads.objectExists(ctx.output.token.url)))
          throw new Error(`File is not uploaded yet!`);
      });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body`, context: ctx.router.state.auth }
        );

        const Avatar = {
          name: Body.token.name,
          url: Body.token.url,
          mimeType: Body.token.mimeType,
          sizeInBytes: Body.token.sizeInBytes,
          alt: Body.token.alt,
        };

        await UserModel.updateOne(
          { _id: ctx.router.state.auth.userId },
          {
            avatar: Avatar,
          }
        );

        return Response.data(Avatar);
      },
    });
  }
}
