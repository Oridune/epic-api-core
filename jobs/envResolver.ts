import { Env, Store, StoreType } from "@Core/common/mod.ts";
import { EnvModel } from "@Models/env.ts";

export default () => {
  const CacheTTL = parseFloat(
    (Env.getSync("ENV_CACHE_TTL_MS", true)) ?? "600000", // Default TTL 10 minutes
  );

  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) =>
    await Store.session(StoreType.MAP, (_) =>
      _.cache(
        ["env", Env.getType(), key], // Env variable cache key
        async () => {
          const Variable = await EnvModel.findOne({ key }); // Fetch Env variable

          return {
            result: Variable?.value,
            expiresInMs: ((Variable?.ttl ?? 0) * 1000) || CacheTTL,
          };
        },
      ));
};
