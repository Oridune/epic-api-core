import {
  BaseController,
  Controller,
  Delete,
  Get,
  type IRequestContext,
  type IRoute,
  Put,
  RequestMethod,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { AwsS3ACLs, Uploads } from "@Lib/uploads/mod.ts";
import { TFileInput, TFileOutput } from "@Models/file.ts";
import OauthController, { TokenPayload } from "@Controllers/oauth.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";

export type SignUploadOptions = {
  allowedContentTypes?: string[] | RegExp;
  minContentLength?: number;
  maxContentLength?: number;
  location?:
    | string
    | ((
      ctx: IRequestContext<RouterContext<string>>,
    ) => string | Promise<string>);
  expiresInMs?: number;
};

@Controller("/uploads/", { name: "uploads" })
export default class UploadsController extends BaseController {
  static UploadTokenType = "upload_request";

  @Get("/sign/")
  static sign(route: IRoute, options?: SignUploadOptions) {
    // Define Query Schema
    const QuerySchema = e
      .object({
        name: e.optional(e.string().max(50)),
        alt: e.optional(e.string().max(50)),
        contentType: options?.allowedContentTypes instanceof Array
          ? e.in(options.allowedContentTypes)
          : e
            .string()
            .matches(options?.allowedContentTypes ?? /^\w+\/[-+.\w]+$/),
        contentLength: e.number({ cast: true }).amount({
          min: options?.minContentLength,
          max: options?.maxContentLength,
        }),
      })
      .rest(e.any);

    // Define Params Schema
    const ParamsSchema = e.record(e.string());

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

        let Location = typeof options?.location === "function"
          ? await options.location(ctx)
          : typeof options?.location === "string"
          ? options.location
          : "/public/";

        const Injection: Record<string, unknown> = {
          ...ctx.router.state.auth,
          ...Query,
          ...Params,
        };

        Location = Location.replace(
          /{{\s*([^{}\s]*)\s*}}/g,
          (match, key) =>
            Injection[key] !== undefined ? `${Injection[key]}` : match,
        );

        const { name, alt, contentType, contentLength, ...restQuery } = Query;

        const UploadRequest = await Uploads.signUploadUrl({
          awsS3ACL: AwsS3ACLs.PUBLIC_READ,
          contentType,
          contentLength,
          location: Location,
          expiresInMs: options?.expiresInMs,
        });

        return Response.data({
          ...UploadRequest,
          token: (
            await OauthController.createToken({
              type: this.UploadTokenType,
              payload: {
                name,
                url: UploadRequest.getUrl,
                mimeType: contentType,
                sizeInBytes: contentLength,
                alt,
                metadata: {
                  ...restQuery,
                  ...Params,
                },
              },
              secret:
                `${ctx.router.state.auth?.accountId}:${ctx.router.state.auth?.userId}`,
              expiresInSeconds: UploadRequest.expiresInSeconds + 30,
            })
          ).token,
        });
      },
    });
  }

  @Get("/")
  @Put("/")
  @Delete("/")
  static upload<T extends TokenPayload>(
    route: IRoute,
    options?: SignUploadOptions,
    onSuccess?: (
      ctx: IRequestContext<RouterContext<string>>,
      file: TFileInput,
      metadata: T,
    ) => Promise<Response | void> | void,
    onDelete?: (
      ctx: IRequestContext<RouterContext<string>>,
      deleteObject: typeof Uploads["deleteObject"],
    ) => Promise<Response | void> | void,
  ) {
    switch (route.options.method) {
      case RequestMethod.GET:
        return UploadsController.sign(route, options);

      case RequestMethod.PUT: {
        // Define Body Schema
        const BodySchema = e
          .object(
            {
              token: e
                .string()
                .custom((ctx) =>
                  OauthController.verifyToken<TFileOutput>({
                    token: ctx.output,
                    type: UploadsController.UploadTokenType,
                    secret: `${ctx.context?.accountId}:${ctx.context?.userId}`,
                  })
                )
                .checkpoint(),
            },
            { allowUnexpectedProps: true },
          )
          .custom(async (ctx) => {
            if (!(await Uploads.objectExists(ctx.output.token.url))) {
              throw new Error(`File is not uploaded yet!`);
            }
          });

        return Versioned.add("1.0.0", {
          postman: {
            body: BodySchema.toSample(),
          },
          handler: async (ctx: IRequestContext<RouterContext<string>>) => {
            // Body Validation
            const Body = await BodySchema.validate(
              await ctx.router.request.body({ type: "json" }).value,
              { name: `${route.scope}.body`, context: ctx.router.state.auth },
            );

            const Upload = {
              createdBy: ctx.router.state.auth?.userId,
              name: Body.token.name,
              url: Body.token.url,
              mimeType: Body.token.mimeType,
              sizeInBytes: Body.token.sizeInBytes,
              alt: Body.token.alt,
            };

            return (
              (await onSuccess?.(ctx, Upload, Body.token.metadata as T)) ??
                Response.data(Upload)
            );
          },
        });
      }

      case RequestMethod.DELETE:
        return Versioned.add("1.0.0", {
          handler: async (ctx: IRequestContext<RouterContext<string>>) => {
            if (typeof onDelete !== "function") {
              ctx.router.throw(
                Status.MethodNotAllowed,
                "This method is not available yet!",
              );
            }

            return (await onDelete(ctx, Uploads.deleteObject.bind(Uploads)) ??
              Response.true());
          },
        });

      default:
        throw new Error("Unsupported upload method!");
    }
  }
}
