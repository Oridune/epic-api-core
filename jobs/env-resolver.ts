import { Env } from "@Core/common/env.ts";
import { EnvModel } from "@Models/env.ts";

export default () => {
  // Following function override will resolve undefined env varables from database.
  Env.onGetFailed = async (key: string) =>
    (await EnvModel.findOne({ type: Env.getType(), key }))?.value;
};
