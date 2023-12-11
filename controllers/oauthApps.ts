import {
  Env,
  Controller,
  BaseController,
  Response,
  Get,
  Post,
  Delete,
  type IRequestContext,
  Versioned,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import { ObjectId } from "mongo";
import { OauthAppSchema, OauthAppModel } from "@Models/oauthApp.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";

@Controller("/oauth/apps/", { group: "Oauth", name: "oauthApps" })
export default class OauthAppsController extends BaseController {
  static DefaultOauthAppID = new ObjectId("63b6a997e1275524350649f4");

  @Post("/")
  public create() {
    // Define Body Schema
    const BodySchema = e.omit(OauthAppSchema, {
      keys: ["_id", "createdAt", "updatedAt", "account", "createdBy"],
    });

    return Versioned.add("1.0.0", {
      postman: {
        body: BodySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body({ type: "json" }).value,
          { name: "oauthApps.body" }
        );

        return Response.data(await OauthAppModel.create(Body)).statusCode(
          Status.Created
        );
      },
    });
  }

  @Get("/")
  public list() {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        limit: e.optional(e.number({ cast: true }).max(2000)).default(2000),
        offset: e.optional(e.number({ cast: true }).min(0)).default(0),
      },
      { allowUnexpectedProps: true }
    );

    return Versioned.add("1.0.0", {
      postman: {
        query: QuerySchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Query Validation
        const Query = await QuerySchema.validate(
          Object.fromEntries(ctx.router.request.url.searchParams),
          { name: "oauthApps.query" }
        );

        return Response.data(
          await OauthAppModel.find().skip(Query.offset).limit(Query.limit)
        );
      },
    });
  }

  @Get("/default/")
  public getDefault() {
    return Versioned.add("1.0.0", {
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        const App =
          (await OauthAppModel.findOne(
            OauthAppsController.DefaultOauthAppID
          )) ??
          (await OauthAppModel.create({
            _id: OauthAppsController.DefaultOauthAppID,
            name: `${await Env.get("DISPLAY_NAME")} (By Oridune)`,
            description: "The default OAuth application.",
            enabled: true,
            consent: {
              requiredIdentificationMethods: [IdentificationMethod.EMAIL],
              primaryColor: "#e85d04",
              secondaryColor: "#faa307",
              allowedCallbackURLs: [
                new URL("/admin/", ctx.router.request.url.origin).toString(),
              ],
              homepageURL: ctx.router.request.url.origin,
            },
          }));

        if (!App) e.error("Default Oauth app not found!");

        return Response.data(App!);
      },
    });
  }

  @Get("/:appId/")
  public get() {
    // Define Params Schema
    const ParamsSchema = e.object({
      appId: e.string(),
    });

    return Versioned.add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "oauthApps.params",
        });

        const App = await OauthAppModel.findOne(Params.appId, {
          cache: { key: `oauth-app:${Params.appId}`, ttl: 60 * 60 }, // Cache for 1 hour
        });

        if (!App) e.error("Oauth app not found!");

        return Response.data(App!);
      },
    });
  }

  @Delete("/:appId/")
  public delete() {
    // Define Params Schema
    const ParamsSchema = e.object({
      appId: e.if(ObjectId.isValid).custom((ctx) => {
        if (OauthAppsController.DefaultOauthAppID.toString() === ctx.output)
          throw "Cannot delete the default Oauth app!";
      }),
    });

    return Versioned.add("1.0.0", {
      postman: {
        params: ParamsSchema.toSample(),
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "oauthApps.params",
        });

        await OauthAppModel.deleteOne({ _id: new ObjectId(Params.appId) });

        return Response.status(true);
      },
    });
  }
}
