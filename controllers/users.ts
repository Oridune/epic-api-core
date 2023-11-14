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
import { Mongo, ObjectId } from "mongo";

import {
  TUserInput,
  CreateUserSchema,
  UpdateUserSchema,
  UserModel,
  UsernameValidator,
  PasswordValidator,
  EmailValidator,
  PhoneValidator,
} from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountModel } from "@Models/account.ts";
import { OauthAppModel } from "@Models/oauth-app.ts";
import { OauthSessionModel } from "@Models/oauth-session.ts";

import { PermanentlyDeleteUsers } from "@Jobs/delete-users.ts";
import UsersIdentificationController, {
  IdentificationMethod,
  IdentificationPurpose,
} from "@Controllers/usersIdentification.ts";
import UploadsController from "@Controllers/uploads.ts";

@Controller("/users/", { group: "Users", name: "users" })
export default class UsersController extends BaseController {
  static create(user: TUserInput) {
    return Mongo.transaction(async (session) => {
      const UserId = new ObjectId();
      const AccountId = new ObjectId();
      const CollaboratorId = new ObjectId();

      const Password = await bcrypt.hash(
        user.password ?? Math.random().toString(36) + Date.now().toString(36)
      );

      const Result = {
        user: await UserModel.create(
          {
            ...user,
            _id: UserId,
            password: Password,
            passwordHistory: [Password],
            collaborates: [CollaboratorId],
          },
          { session }
        ),
        account: await AccountModel.create(
          {
            _id: AccountId,
            createdBy: UserId,
            createdFor: UserId,
          },
          { session }
        ),
        collaborator: await CollaboratorModel.create(
          {
            _id: CollaboratorId,
            createdBy: UserId,
            createdFor: UserId,
            account: AccountId,
            isOwned: true,
            isPrimary: true,
            role: ["", undefined].includes(
              await Env.get("VERIFIED_ROLE_POLICY", true)
            )
              ? "user"
              : "unverified",
          },
          { session }
        ),
      };

      return Result;
    });
  }

  static async verify(method: IdentificationMethod, userId: string) {
    switch (method) {
      case IdentificationMethod.EMAIL:
        await UserModel.updateOne(userId, { isEmailVerified: true });
        break;

      case IdentificationMethod.PHONE:
        await UserModel.updateOne(userId, { isPhoneVerified: true });
        break;

      default:
        throw new Error(`Invalid identification method for verification!`);
    }
  }

  static async scheduleDeletion(
    userId: string,
    options?: { timeoutMs?: number }
  ) {
    await UserModel.updateOne(userId, {
      deletionAt: new Date(
        Date.now() +
          (options?.timeoutMs ??
            parseFloat(
              (await Env.get("USER_DELETION_TIMEOUT_MS", true)) ?? "1.296e+9" // Deletion in 15 days default
            ))
      ),
    });
  }

  @Post("/:oauthAppId/")
  public create(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      oauthAppId: e.string().custom(async (ctx) => {
        if (!(await OauthAppModel.exists(ctx.parent!.output.oauthAppId)))
          throw new Error(`Invalid oauth app id!`);
      }),
    });

    // Define Body Schema
    const BodySchema = e
      .omit(CreateUserSchema, {
        keys: ["oauthApp", "username", "password"],
      })
      .extends(
        e.object({
          username: UsernameValidator().custom(async (ctx) => {
            if (await UserModel.count({ username: ctx.output }))
              throw "Username is already taken!";
          }),
          password: PasswordValidator(),
        })
      );

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
          { name: `${route.scope}.body` }
        );

        // deno-lint-ignore no-unused-vars
        const { password, passwordHistory, oauthApp, collaborates, ...User } = (
          await UsersController.create({
            oauthApp: new ObjectId(Params.oauthAppId),
            ...Body,
            passwordHistory: [],
            collaborates: [],
          })
        ).user;

        return Response.statusCode(Status.Created).data(User);
      },
    };
  }

  @Patch("/me/")
  public update(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.partial(UpdateUserSchema, { nullish: true });

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
        await UserModel.updateOne(ctx.router.state.auth.userId, Body);

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
          await UsersIdentificationController.verify<{
            userId: string;
          }>(
            Body.token,
            Body.code,
            IdentificationPurpose.RECOVERY,
            Body.method
          ).catch(e.error));

        const User = await UserModel.findOne(Payload.userId).project({
          passwordHistory: 1,
        });

        if (!User) e.error(`User not found!`);

        if (
          User!.passwordHistory?.some((hashedPassword) =>
            bcrypt.compareSync(Body.password, hashedPassword)
          )
        )
          e.error(`Cannot use an old password!`);

        await UserModel.updateOne(
          { _id: new ObjectId(Payload.userId) },
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
        if (await UserModel.count({ email: ctx.output }))
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

        await UserModel.updateOne(ctx.router.state.auth.userId, {
          email: Body.email,
          isEmailVerified: Verified,
        });

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
        if (await UserModel.count({ phone: ctx.output }))
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

        await UserModel.updateOne(ctx.router.state.auth.userId, {
          phone: Body.phone,
          isPhoneVerified: Verified,
        });

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
          await UsersIdentificationController.verify<{
            userId: string;
          }>(
            Body.token,
            Body.code,
            IdentificationPurpose.VERIFICATION,
            Body.method
          ).catch(e.error));

        await UsersController.verify(Body.method, Payload.userId);

        return Response.true();
      },
    });
  }

  @Get("/:userId?/")
  public listAll(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
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
        const Users = await UserModel.find(
          Params.userId ? { _id: new ObjectId(Params.userId) } : {}
        )
          .populate(
            "collaborates",
            CollaboratorModel.populateOne("account", AccountModel)
          )
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
        const User = await UserModel.findOne(
          ctx.router.state.auth.userId
        ).populate(
          "collaborates",
          CollaboratorModel.populateOne("account", AccountModel)
        );

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
          createdBy: new ObjectId(ctx.router.state.auth.userId),
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
  @Put("/avatar/")
  public updateAvatar(route: IRoute) {
    return UploadsController.upload(
      route,
      {
        allowedContentTypes: [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/svg+xml",
          "image/webp",
        ],
        maxContentLength: 2e6,
        location: "users/{{userId}}/avatar/",
      },
      async (ctx, avatar) => {
        await UserModel.updateOne(ctx.router.state.auth!.userId, {
          avatar,
        });
      }
    );
  }
}
