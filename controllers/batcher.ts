import {
  BaseController,
  Controller,
  type IRequestContext,
  type IRoute,
  Post,
  RequestMethod,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { type RouterContext } from "oak";
import e, { inferOutput } from "validator";

const RequestInputSchema = () =>
  e.object({
    endpoint: e.optional(e.string()),
    method: e.optional(e.in(Object.values(RequestMethod))).default(
      RequestMethod.GET,
    ),
    headers: e.optional(e.record(e.string())),
    body: e.optional(e.any()),
  });

export type TRequestInput = inferOutput<typeof RequestInputSchema>;

@Controller("/batcher/", { name: "batcher" })
export default class BatcherController extends BaseController {
  @Post("/")
  public request(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      requests: e.array(e.or([
        e.string(),
        RequestInputSchema(),
        e.array(e.or([
          e.string(),
          RequestInputSchema(),
        ])).min(1),
      ])).min(1),
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

        return Response.data({
          responses: await Promise.all(
            Body.requests.map(async (subRequests) => {
              const SubRequests = subRequests instanceof Array
                ? subRequests
                : [subRequests];
              const Responses: Array<unknown> = [];

              for (const RawRequest of SubRequests) {
                const Request = (typeof RawRequest === "string"
                  ? {
                    endpoint: RawRequest,
                    method: RequestMethod.GET,
                  }
                  : RawRequest) as TRequestInput;

                Request.endpoint = new URL(
                  Request.endpoint ? Request.endpoint.replace(/^\//g, "") : "",
                  new URL("/api/", ctx.router.request.url.origin),
                ).toString();

                Responses.push(
                  await fetch(
                    Request.endpoint!,
                    {
                      method: Request.method,
                      headers: {
                        ...Object.fromEntries(
                          ctx.router.request.headers.entries(),
                        ),
                        ...Request.headers,
                      },
                      body: Request.body,
                    },
                  ).then((_) => _.json()),
                );
              }

              return subRequests instanceof Array ? Responses : Responses[0];
            }),
          ),
        });
      },
    });
  }
}
