import { Env, Store } from "@Core/common/mod.ts";
import { EnvModel } from "@Models/env.ts";

export default () => {
  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) => {
    const CacheKey = `${Env.getType()}:${key}`;
    const CachedValue = await Store.get(CacheKey);

    if (typeof CachedValue === "string") return CachedValue;

    const Value = (await EnvModel.findOne({ key }))?.value;

    if (typeof Value === "string") {
      await Store.set(CacheKey, Value, {
        expiresInMs: parseFloat(
          (await Env.get("ENV_CACHE_TTL_MS", true)) ?? "600000", // Default TTL 10 minutes
        ),
      });
    }

    return Value;
  };
};
