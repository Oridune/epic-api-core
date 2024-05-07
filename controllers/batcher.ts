import {
  BaseController,
  Controller,
  fetch,
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
      requests: e.array(
        e.or([
          e.array(
            e.or([
              RequestInputSchema(),
              e.string(),
            ]),
          ).min(1),
          RequestInputSchema(),
          e.string(),
        ]),
      ).min(1),
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

        const CurrentHeaders = Object.fromEntries(
          ctx.router.request.headers.entries(),
        );

        return Response.data({
          responses: await Promise.all(
            Body.requests.map(async (subRequests) => {
              const SubRequests = subRequests instanceof Array
                ? subRequests
                : [subRequests];
              const Responses: Array<unknown> = [];

              for (const RawRequest of SubRequests) {
                const RequestPayload = (typeof RawRequest === "string"
                  ? {
                    endpoint: RawRequest,
                    method: RequestMethod.GET,
                  }
                  : RawRequest) as TRequestInput;

                try {
                  const Response = await fetch(
                    ctx.router.app,
                    new URL(
                      RequestPayload.endpoint
                        ? RequestPayload.endpoint.replace(/^\//g, "")
                        : "",
                      new URL("/api/", ctx.router.request.url.origin),
                    ),
                    {
                      method: RequestPayload.method,
                      headers: {
                        ...(CurrentHeaders["user-agent"] &&
                          { "user-agent": CurrentHeaders["user-agent"] }),
                        ...(CurrentHeaders.authorization &&
                          { authorization: CurrentHeaders.authorization }),
                        ...(CurrentHeaders["x-account-id"] &&
                          { "x-account-id": CurrentHeaders["x-account-id"] }),
                        ...(CurrentHeaders["x-api-version"] &&
                          { "x-api-version": CurrentHeaders["x-api-version"] }),
                        ...RequestPayload.headers,
                      },
                      body: (typeof RequestPayload.body === "string"
                        ? RequestPayload.body
                        : JSON.stringify(RequestPayload.body ?? {})),
                    },
                  );

                  const Data = await Response?.json();

                  Responses.push(Data);
                } catch (error) {
                  Responses.push(
                    Response.false().message(error.message).getBody(),
                  );
                }
              }

              return subRequests instanceof Array ? Responses : Responses[0];
            }),
          ),
        });
      },
    });
  }
}
