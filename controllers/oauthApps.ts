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
import mongoose from "mongoose";
import { OauthAppModel } from "@Models/oauth-app.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";

@Controller("/oauth/apps/", { group: "Oauth", name: "oauthApps" })
export default class OauthAppsController extends BaseController {
  static DefaultOauthAppID = new mongoose.Types.ObjectId(
    "63b6a997e1275524350649f4"
  );

  @Post("/")
  public create() {
    // Define Body Schema
    const BodySchema = e.object({
      name: e.string().length({ min: 2, max: 50 }),
      description: e.optional(e.string().length({ min: 30, max: 300 })),
      consent: e.object({
        requiredIdentificationMethods: e
          .optional(e.array(e.in(Object.values(IdentificationMethod))))
          .default([IdentificationMethod.EMAIL]),
        logo: e.optional(
          e.object({
            url: e.string().custom((ctx) => new URL(ctx.output).toString()),
          })
        ),
        primaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
        secondaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
        allowedCallbackURLs: e
          .array(
            e.string().custom((ctx) => new URL(ctx.output).toString()),
            { cast: true, splitter: /\s*,\s*/ }
          )
          .length({ min: 1 }),
        homepageURL: e.string().custom((ctx) => new URL(ctx.output).toString()),
        privacyPolicyURL: e.optional(
          e.string().custom((ctx) => new URL(ctx.output).toString())
        ),
        termsAndConditionsURL: e.optional(
          e.string().custom((ctx) => new URL(ctx.output).toString())
        ),
        supportURL: e.optional(
          e.string().custom((ctx) => new URL(ctx.output).toString())
        ),
      }),
      metadata: e.optional(e.record(e.string())),
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

        const App = new OauthAppModel(Body);
        await App.save();

        return Response.data(App).statusCode(Status.Created);
      },
    });
  }

  @Get("/")
  public list() {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        limit: e.optional(e.number({ cast: true })).default(Infinity),
        offset: e.optional(e.number({ cast: true })).default(0),
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
          (await OauthAppModel.findOne({
            _id: OauthAppsController.DefaultOauthAppID,
          })) ??
          (await new OauthAppModel({
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
          }).save());

        if (!App) e.error("Default Oauth app not found!");

        return Response.data(App!);
      },
    });
  }

  @Get("/:appId/")
  public get() {
    // Define Params Schema
    const ParamsSchema = e.object({
      appId: e.string().custom((ctx) => {
        if (!mongoose.Types.ObjectId.isValid(ctx.output))
          throw "Not a valid id!";
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

        const App = await OauthAppModel.findOne({ _id: Params.appId });
        if (!App) e.error("Oauth app not found!");

        return Response.data(App!);
      },
    });
  }

  @Delete("/:appId/")
  public delete() {
    // Define Params Schema
    const ParamsSchema = e.object({
      appId: e.string().custom((ctx) => {
        if (!mongoose.Types.ObjectId.isValid(ctx.output))
          throw "Not a valid id!";

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

        await OauthAppModel.deleteOne({ _id: Params.appId });

        return Response.status(true);
      },
    });
  }
}
