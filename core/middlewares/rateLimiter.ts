// deno-lint-ignore-file no-explicit-any
import { Context, Status } from "oak";
import { Env, EnvType, Store } from "@Core/common/mod.ts";

export type RateLimitOptions = {
  onRateLimit?: (
    ctx: Context<Record<string, any>, Record<string, any>>,
    next: () => Promise<unknown>,
    options: RateLimitOptions,
  ) => Promise<unknown> | unknown;
  limit?: number | string;
  windowMs?: number | string;
};

export const rateLimiter = (options?: RateLimitOptions) => {
  const DefaultLimit = 50;
  const DefaultWindowMs = Env.is(EnvType.TEST) ? 50000 : 1000;

  const RawLimit = parseInt((options?.limit ?? DefaultLimit).toString());
  const RawWindowMs = parseInt(
    (options?.windowMs ?? DefaultWindowMs).toString(),
  );

  const Limit = isNaN(RawLimit) ? DefaultLimit : RawLimit;
  const WindowMs = isNaN(RawWindowMs) ? DefaultWindowMs : RawWindowMs;

  return async (
    ctx: Context<Record<string, any>, Record<string, any>>,
    next: () => Promise<unknown>,
  ) => {
    // Each proxy appends to x-forwarded-for, so the entries our own proxies
    // added are at the end. Anything before them was set by the client and
    // would otherwise hand them a fresh "IP" on every request.
    const ForwardedFor = ctx.request.headers.get("x-forwarded-for")
      ?.split(",").map((_) => _.trim()).filter(Boolean) ?? [];

    const RawTrustedProxies = parseInt(
      Env.getSync("TRUSTED_PROXY_COUNT", true) ?? "1",
    );
    const TrustedProxies = isNaN(RawTrustedProxies) ? 1 : RawTrustedProxies;

    const ip = ForwardedFor[ForwardedFor.length - TrustedProxies] ||
      ctx.request.ip;

    const rateLimitKey = `rateLimitIp:${ip}`;

    const Count = await Store.incr(rateLimitKey, { expiresInMs: WindowMs });
    const CountTimestamp = (await Store.timestamp(rateLimitKey)) ?? Date.now();

    const XRateLimitReset = Math.round(
      (CountTimestamp + WindowMs) / 1000,
    ).toString();
    const XRateLimitLimit = Limit.toString();
    const XRateLimitRemaining = Math.max(Limit - Count - 1, 0).toString();
    const ErrorProps = {
      "X-Rate-Limit-Reset": XRateLimitReset,
      "X-Rate-Limit-Limit": XRateLimitLimit,
      "X-Rate-Limit-Remaining": XRateLimitRemaining,
    };

    if (Count >= Limit) {
      ctx.response.status = Status.TooManyRequests;

      if (typeof options?.onRateLimit === "function") {
        await options.onRateLimit(ctx, next, {
          ...options,
          limit: Limit,
          windowMs: WindowMs,
        });
      } else {ctx.throw(
          Status.TooManyRequests,
          "You've reached your request limits!",
          ErrorProps,
        );}
    } else {
      await next().catch((error: any) => {
        Object.assign(error, ErrorProps);
        throw error;
      });
    }

    ctx.response.headers.set("X-Rate-Limit-Reset", XRateLimitReset);
    ctx.response.headers.set("X-Rate-Limit-Limit", XRateLimitLimit);
    ctx.response.headers.set("X-Rate-Limit-Remaining", XRateLimitRemaining);
  };
};
