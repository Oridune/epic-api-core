import { Env } from "@Core/common/env.ts";

export const getNotify = async () => {
  const { EpicSDK } = await import("notify");

  if (!EpicSDK._axios) {
    EpicSDK.init({
      axiosConfig: {
        baseURL: Env.getSync("NOTIFY_HOST", true) ?? "https://notify.sabil.ly",
        headers: {
          Authorization: `apikey ${Env.getSync("NOTIFY_API_KEY")}`,
        },
      },
    });
  }

  return EpicSDK;
};
