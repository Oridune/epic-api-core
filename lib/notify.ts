import { ITriggerPayloadOptions, Novu as _Novu } from "novu";
import { Env } from "@Core/common/env.ts";
import { UserModel } from "@Models/user.ts";

export const Novu = new _Novu(Env.getSync("NOVU_API_KEY"));

export type NovuTriggerOptions = {
  subscriberId?: string;
  userFilter?: Parameters<(typeof UserModel)["findOne"]>[0];
  email?: string;
  phone?: string;
  template: string;
  payload: ITriggerPayloadOptions["payload"];
};

export class Notify {
  static async sendWithNovu(options: NovuTriggerOptions) {
    let SubscriberId = options.subscriberId;

    if (!SubscriberId) {
      if (options.userFilter) {
        const User = await UserModel.findOne(options.userFilter).project({
          _id: 1,
        });

        SubscriberId = User?._id.toString();
      }

      if (!SubscriberId) SubscriberId = options.email ?? options.phone;
    }

    if (!SubscriberId) throw new Error("No recipient provided!");

    const SubscriberData = { email: options.email, phone: options.phone };

    await Novu.subscribers
      .update(SubscriberId, SubscriberData)
      .catch(() => Novu.subscribers.identify(SubscriberId!, SubscriberData));

    await Novu.trigger(options.template, {
      to: { subscriberId: SubscriberId, ...SubscriberData },
      payload: options.payload,
    }).catch((error) => {
      if (error.response.data.message === "workflow_not_found")
        throw new Error(`Notification workflow template not found!`, {
          cause: error,
        });
      else throw new Error(error.response.data.message, { cause: error });
    });
  }
}
