import {
  BaseController,
  Controller,
  Delete,
  Env,
  Get,
  type IRequestContext,
  type IRoute,
  Patch,
  Post,
  Put,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";
import * as bcrypt from "bcrypt";
import { Mongo, ObjectId } from "mongo";

import {
  CreateUserSchema,
  EmailValidator,
  PasswordValidator,
  PhoneValidator,
  TUserInput,
  UpdateUserSchema,
  UserModel,
  UsernameValidator,
  UserReferenceValidator,
} from "@Models/user.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountModel } from "@Models/account.ts";
import { OauthAppModel } from "@Models/oauthApp.ts";
import { OauthSessionModel } from "@Models/oauthSession.ts";

import { PermanentlyDeleteUser } from "@Jobs/deleteUsers.ts";
import UsersIdentificationController, {
  IdentificationMethod,
  IdentificationPurpose,
} from "@Controllers/usersIdentification.ts";
import UploadsController from "@Controllers/uploads.ts";

@Controller("/users/", { group: "Users", name: "users" })
export default class UsersController extends BaseController {
  static async create(
    user: Omit<TUserInput, "role" | "passwordHistory" | "collaborates">,
  ) {
    if (
      user.reference && await UserModel.exists({ reference: user.reference })
    ) throw new Error(`Reference already registered!`);

    return Mongo.transaction(async (session) => {
      const UserId = new ObjectId();
      const AccountId = new ObjectId();
      const CollaboratorId = new ObjectId();

      const Password = await bcrypt.hash(
        user.password ?? Math.random().toString(36) + Date.now().toString(36),
      );

      const Result = {
        user: await UserModel.create(
          {
            ...user,
            _id: UserId,
            password: Password,
            passwordHistory: [Password],
            role: ["", undefined].includes(
                await Env.get("VERIFIED_ROLE_POLICY", true),
              )
              ? "user"
              : "unverified",
            collaborates: [CollaboratorId],
          },
          { session },
        ),
        account: await AccountModel.create(
          {
            _id: AccountId,
            createdBy: UserId,
            createdFor: UserId,
          },
          { session },
        ),
        collaborator: await CollaboratorModel.create(
          {
            _id: CollaboratorId,
            createdBy: UserId,
            createdFor: UserId,
            account: AccountId,
            isOwned: true,
            isPrimary: true,
          },
          { session },
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
    options?: { timeoutMs?: number },
  ) {
    await UserModel.updateOne(userId, {
      deletionAt: new Date(
        Date.now() +
          (options?.timeoutMs ??
            parseFloat(
              (await Env.get("USER_DELETION_TIMEOUT_MS", true)) ?? "1.296e+9", // Deletion in 15 days default
            )),
      ),
    });
  }

  @Post("/:oauthAppId/")
  public create(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        reference: e.optional(e.string()).custom(async (ctx) => {
          if (
            typeof ctx.output === "string" &&
            !(await UserReferenceValidator().test(ctx.output))
          ) ctx.output = undefined;
        }),
      },
      { allowUnexpectedProps: true },
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      oauthAppId: e.string().custom(async (ctx) => {
        if (!(await OauthAppModel.exists(ctx.parent!.output.oauthAppId))) {
          throw new Error(`Invalid oauth app id!`);
        }
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
            if (await UserModel.count({ username: ctx.output })) {
              throw "Username is already taken!";
            }
          }),
          password: PasswordValidator(),
        }),
      );

    return {
      postman: {
        query: QuerySchema.toSample(),
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` },
        );

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: `${route.scope}.body` },
        );

        // deno-lint-ignore no-unused-vars
        const { password, passwordHistory, oauthApp, collaborates, ...User } = (
          await UsersController.create({
            oauthApp: new ObjectId(Params.oauthAppId),
            reference: Query.reference,
            ...Body,
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
          { name: `${route.scope}.body` },
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
          { name: `${route.scope}.body` },
        );

        const Payload =
          (ctx.router.state.verifyTokenPayload =
            await UsersIdentificationController.verify<{
              userId: string;
            }>(
              Body.token,
              Body.code,
              IdentificationPurpose.RECOVERY,
              Body.method,
            ).catch(e.error));

        const User = await UserModel.findOne(Payload.userId).project({
          passwordHistory: 1,
        });

        if (!User) e.error(`User not found!`);

        if (
          User!.passwordHistory?.some((hashedPassword) =>
            bcrypt.compareSync(Body.password, hashedPassword)
          )
        ) {
          e.error(`Cannot use an old password!`);
        }

        await UserModel.updateOne(
          { _id: new ObjectId(Payload.userId) },
          {
            password: Body.hashedPassword,
            $push: { passwordHistory: Body.hashedPassword },
            isBlocked: false,
          },
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
        if (await UserModel.count({ email: ctx.output })) {
          throw "Please provide a different email!";
        }
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
          { name: `${route.scope}.body` },
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
        if (await UserModel.count({ phone: ctx.output })) {
          throw "Please provide a different phone!";
        }
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
          { name: `${route.scope}.body` },
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
          { name: `${route.scope}.body` },
        );

        const Payload =
          (ctx.router.state.verifyTokenPayload =
            await UsersIdentificationController.verify<{
              userId: string;
            }>(
              Body.token,
              Body.code,
              IdentificationPurpose.VERIFICATION,
              Body.method,
            ).catch(e.error));

        await UsersController.verify(Body.method, Payload.userId);

        return Response.true();
      },
    });
  }

  @Get("/:id?/")
  public get(route: IRoute) {
    const CurrentTimestamp = Date.now();

    // Define Query Schema
    const QuerySchema = e.object(
      {
        search: e.optional(e.string()),
        range: e.optional(
          e.tuple([e.date().end(CurrentTimestamp), e.date()], { cast: true }),
        ),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        sort: e
          .optional(
            e.record(e.number({ cast: true }).min(-1).max(1), { cast: true }),
          )
          .default({ _id: -1 }),
        project: e.optional(
          e.record(e.number({ cast: true }).min(0).max(1), { cast: true }),
        ),
        includeTotalCount: e.optional(
          e
            .boolean({ cast: true })
            .describe(
              "If `true` is passed, the system will return a total items count for pagination purpose.",
            ),
        ),
      },
      { allowUnexpectedProps: true },
    );

    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
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
          { name: `${route.scope}.query` },
        );

        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Fetch users
        const UsersListQuery = UserModel.search(Query.search)
          .filter({
            ...(Params.id ? { _id: new ObjectId(Params.id) } : {}),
            ...(Query.range instanceof Array
              ? {
                createdAt: {
                  $gt: new Date(Query.range[0]),
                  $lt: new Date(Query.range[1]),
                },
              }
              : {}),
          })
          .project({
            password: 0,
            passwordHistory: 0,
          })
          .skip(Query.offset)
          .limit(Query.limit)
          .sort(Query.sort)
          .populate(
            "collaborates",
            CollaboratorModel.populateOne("account", AccountModel),
          );

        if (Query.project) UsersListQuery.project(Query.project);

        return Response.data({
          totalCount: Query.includeTotalCount
            //? Make sure to pass any limiting conditions for count if needed.
            ? await UserModel.count()
            : undefined,
          users: await UsersListQuery,
        });
      },
    });
  }

  @Get("/me/")
  public me(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        project: e.optional(
          e.record(e.number({ cast: true }).min(0).max(1), { cast: true }),
        ),
      },
      { allowUnexpectedProps: true },
    );

    return Versioned.add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: `${route.scope}.query` },
        );

        // Fetch user
        const UserQuery = UserModel.findOne(ctx.router.state.auth.userId)
          .project({
            password: 0,
            passwordHistory: 0,
          })
          .populate(
            "collaborates",
            CollaboratorModel.populateOne("account", AccountModel),
          );

        if (Query.project) UserQuery.project(Query.project);

        return Response.data({
          user: await UserQuery,
        });
      },
    });
  }

  @Delete("/")
  public delete(route: IRoute) {
    // Define Query Schema
    const QuerySchema = e.object(
      { deletionTimeoutMs: e.optional(e.number({ cast: true })) },
      { allowUnexpectedProps: true },
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
          { name: `${route.scope}.query` },
        );

        const UserId = new ObjectId(ctx.router.state.auth.userId);

        // Logout all sessions
        await OauthSessionModel.deleteMany({
          createdBy: UserId,
        });

        if (Query.deletionTimeoutMs === 0) {
          // Instant user deletion
          await PermanentlyDeleteUser.exec({ userId: UserId });
        } else {
          await UsersController.scheduleDeletion(ctx.router.state.auth.userId, {
            timeoutMs: Query.deletionTimeoutMs,
          });
        }

        return Response.true();
      },
    });
  }

  @Patch("/role/:id/")
  public updateRole(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.optional(e.string()),
    });

    // Define Body Schema
    const BodySchema = e.object({
      role: e.string(),
    });

    return new Versioned().add("1.0.0", {
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
          { name: `${route.scope}.body` },
        );

        await UserModel.updateOneOrFail(Params.id, { role: Body.role });

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
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        await UserModel.updateOne(ctx.router.state.auth!.userId, {
          avatar,
        });
      },
    );
  }

  @Patch("/toggle/blocked/:id/:isBlocked/")
  public toggleBlocked(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.string(),
      isBlocked: e.boolean({ cast: true }),
    });

    return new Versioned().add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Update user's blocking status
        await UserModel.updateOneOrFail(Params.id, {
          isBlocked: Params.isBlocked,
        });

        return Response.true();
      },
    });
  }
}
