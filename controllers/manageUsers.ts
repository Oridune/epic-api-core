import {
  BaseController,
  Controller,
  type IRequestContext,
  type IRoute,
  Put,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { PasswordValidator, UserModel } from "@Models/user.ts";
import { hash as bcryptHash } from "bcrypt";

@Controller("/manage/users/", { group: "User", name: "manageUsers" })
export default class ManageUsersController extends BaseController {
  @Put("/password/:id/")
  public updatePassword(route: IRoute) {
    // Define Params Schema
    const ParamsSchema = e.object({
      id: e.instanceOf(ObjectId, { instantiate: true }),
    });

    // Define Body Schema
    const BodySchema = e.object({
      password: PasswordValidator(),
      hashedPassword: e
        .any()
        .custom((ctx) => bcryptHash(ctx.parent?.output.password)),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        params: ParamsSchema.toSample(),
        body: BodySchema.toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: `${route.scope}.params`,
        });

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        await UserModel.updateOneOrFail(
          Params.id,
          {
            password: Body.hashedPassword,
            $push: {
              passwordHistory: {
                $each: [Body.hashedPassword],
                $slice: -10,
              },
            },
            failedLoginAttempts: 0,
            deletionAt: null,
          },
        );

        return Response.true();
      },
    });
  }
}
