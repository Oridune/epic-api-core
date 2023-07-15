import { Env } from "@Core/common/env.ts";
import { OauthAppModel } from "@Models/oauth-app.ts";
import mongoose from "mongoose";

export const DefaultOauthAppID = new mongoose.Types.ObjectId(
  "63b6a997e1275524350649f4"
);

export default async () => {
  if (!(await OauthAppModel.exists({ _id: DefaultOauthAppID }))) {
    const PublicURL = new URL(await Env.get("PUBLIC_URL"));
    const CallbackURL = new URL("/admin/", PublicURL);

    await new OauthAppModel({
      _id: DefaultOauthAppID,
      name: await Env.get("DISPLAY_NAME"),
      description: "The default oauth application.",
      enabled: true,
      consent: {
        primaryColor: "#e85d04",
        secondaryColor: "#faa307",
        allowedCallbackURLs: [CallbackURL.toString()],
        homepageURL: PublicURL.toString(),
      },
    }).save();
  }
};
