import { Env, Store } from "@Core/common/mod.ts";
import { EnvModel } from "@Models/env.ts";

export default () => {
  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) =>
    await Store.cache(
      ["env", Env.getType(), key], // Env variable cache key
      async () => (await EnvModel.findOne({ key }))?.value, // Fetch Env variable
      parseFloat(
        (Env.getSync("ENV_CACHE_TTL_MS", true)) ?? "600000", // Default TTL 10 minutes
      ),
    );
};
