import { RouterContext } from "oak";
import { IRequestContext, Response } from "@Core/common/mod.ts";

export default () => {
  addEventListener("Authenticate", (e) => {
    const Evt = e as CustomEvent<{
      ctx: IRequestContext<RouterContext<string>>;
      res: Response;
    }>;

    console.log(
      "Authenticated!",
      Evt.detail.res,
      Evt.detail.ctx.router.request.headers.get("user-agent")
    );
  });
};
