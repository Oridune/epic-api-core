import { Env, Store, StoreType } from "@Core/common/mod.ts";
import { EnvModel } from "@Models/env.ts";

export default () => {
  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) =>
    await Store.session(StoreType.MAP, (_) =>
      _.cache(
        ["envCache", Env.getType(), key], // Env variable cache key
        async () => {
          // Fetch Env variable
          const Variable = await EnvModel.findOne({ key }).project({
            value: 1,
            ttl: 1,
          });

          return {
            result: Variable?.value,
            expiresInMs: ((Variable?.ttl ?? 0) * 1000) || 600000, // Default TTL 10 minutes
          };
        },
      ));
};
