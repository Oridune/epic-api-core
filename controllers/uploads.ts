import {
  Controller,
  BaseController,
  Get,
  Versioned,
  Response,
  type IRoute,
  type IRequestContext,
} from "@Core/common/mod.ts";
import { type RouterContext } from "oak";
import e from "validator";
import { Uploads, AwsS3ACLs } from "@Lib/uploads/mod.ts";
import OauthController from "@Controllers/oauth.ts";

@Controller("/uploads/", { name: "uploads" })
export default class UploadsController extends BaseController {
  static UploadTokenType = "upload_request";

  @Get("/")
  static sign(
    route: IRoute,
    options?: {
      allowedContentTypes?: string[] | RegExp;
      minContentLength?: number;
      maxContentLength?: number;
      location?: string;
      expiresInMs?: number;
    }
  ) {
    // Define Query Schema
    const QuerySchema = e.object(
      {
        name: e.optional(e.string().max(50)),
        alt: e.optional(e.string().max(50)),
        contentType:
          options?.allowedContentTypes instanceof Array
            ? e.in(options.allowedContentTypes)
            : e
                .string()
                .matches(options?.allowedContentTypes ?? /^\w+\/[-+.\w]+$/),
        contentLength: e.number({ cast: true }).amount({
          min: options?.minContentLength,
          max: options?.maxContentLength,
        }),
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
          { name: `${route.scope}.query` }
        );

        let Location = options?.location ?? "/public/";

        if (ctx.router.state.auth)
          Location = Location
            // Interpolation
            .replace(/{{\s*accountId\s*}}/g, ctx.router.state.auth.accountId)
            .replace(/{{\s*userId\s*}}/g, ctx.router.state.auth.userId);

        const UploadRequest = await Uploads.signUploadUrl({
          awsS3ACL: AwsS3ACLs.PUBLIC_READ,
          contentType: Query.contentType,
          contentLength: Query.contentLength,
          location: Location,
          expiresInMs: options?.expiresInMs,
        });

        return Response.data({
          ...UploadRequest,
          token: (
            await OauthController.createToken({
              type: this.UploadTokenType,
              payload: {
                name: Query.name,
                url: UploadRequest.getUrl,
                mimeType: Query.contentType,
                sizeInBytes: Query.contentLength,
                alt: Query.alt,
              },
              secret: ctx.router.state.auth?.userId,
              expiresInSeconds: UploadRequest.expiresInSeconds + 30,
            })
          ).token,
        });
      },
    });
  }
}
