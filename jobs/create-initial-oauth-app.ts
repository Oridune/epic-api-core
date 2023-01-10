import { Env } from "@Core/common/env.ts";
import { OauthAppModel } from "@Models/oauth-app.ts";

export default async () => {
  if (!(await OauthAppModel.exists({}))) {
    const ReturnURL = new URL("/admin/", Env.get("PUBLIC_URL"));

    ReturnURL.searchParams.set("code", "{{AUTH_CODE}}");

    await new OauthAppModel({
      name: "default",
      displayName: Env.get("DISPLAY_NAME"),
      description: "The default oauth application.",
      homepageUrl: Env.get("PUBLIC_URL"),
      returnUrl: ReturnURL.toString(),
      metadata: {
        consentPrimaryColor: "#e85d04",
        consentSecondaryColor: "#faa307",
      },
    }).save();
  }
};
