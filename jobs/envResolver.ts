import { Env, Store } from "@Core/common/mod.ts";
import { EnvModel } from "@Models/env.ts";
import { MapStore } from "@Core/common/store/map.ts";

export default () => {
  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) =>
    await Store.cache(
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
      { store: MapStore },
    );
};
