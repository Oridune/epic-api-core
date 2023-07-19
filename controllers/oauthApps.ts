import {
  Controller,
  BaseController,
  Response,
  Get,
  Post,
  Delete,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { Status, type RouterContext } from "oak";
import e from "validator";
import mongoose from "mongoose";

import { OauthAppModel } from "@Models/oauth-app.ts";
import { DefaultOauthAppID } from "@Jobs/create-initial-oauth-app.ts";

@Controller("/oauth/apps/", { name: "oauthApps" })
export default class OauthAppsController extends BaseController {
  @Post("/")
  public create() {
    // Define Body Schema
    const BodySchema = e.object({
      name: e.string().length({ min: 2, max: 50 }),
      description: e.optional(e.string().length(300)),
      consent: e.object({
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

    return {
      postman: {
        body: BodySchema.toSample().data,
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
    };
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

    return {
      postman: {
        query: QuerySchema.toSample().data,
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
    };
  }

  @Get("/default/")
  public getDefault() {
    return {
      handler: async () => {
        const App = await OauthAppModel.findOne({ _id: DefaultOauthAppID });
        if (!App) e.error("Default Oauth app not found!");
        return Response.data(App!);
      },
    };
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

    return {
      postman: {
        params: ParamsSchema.toSample().data,
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
    };
  }

  @Delete("/:appId/")
  public delete() {
    // Define Params Schema
    const ParamsSchema = e.object({
      appId: e.string().custom((ctx) => {
        if (!mongoose.Types.ObjectId.isValid(ctx.output))
          throw "Not a valid id!";

        if (DefaultOauthAppID.toString() === ctx.output)
          throw "Cannot delete the default Oauth app!";
      }),
    });

    return {
      postman: {
        params: ParamsSchema.toSample().data,
      },
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Params Validation
        const Params = await ParamsSchema.validate(ctx.router.params, {
          name: "oauthApps.params",
        });

        await OauthAppModel.deleteOne({ _id: Params.appId });

        return Response.status(true);
      },
    };
  }
}
