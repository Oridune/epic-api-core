import { ITriggerPayloadOptions, Novu as _Novu } from "novu";
import { Env } from "@Core/common/env.ts";
import { UserModel } from "@Models/user.ts";

export const Novu = new _Novu(Env.getSync("NOVU_API_KEY"));

export type NovuTriggerPayload = ITriggerPayloadOptions["payload"];

export type NovuTriggerOptions = {
  subscriberId?: string;
  userFilter?: Parameters<(typeof UserModel)["findOne"]>[0];
  email?: string;
  phone?: string;
  template: string;
  payload: NovuTriggerPayload;
};

export type NovuManyTriggerOptions = {
  subscriberIds: string[];
  template: string;
  payload: NovuTriggerPayload;
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

    if (!SubscriberId) throw new Error("Recipient not found!");

    const SubscriberData = { email: options.email, phone: options.phone };

    if (options.email || options.phone) {
      await Novu.subscribers
        .update(SubscriberId, SubscriberData)
        .catch(() => Novu.subscribers.identify(SubscriberId!, SubscriberData));
    }

    await Novu.trigger(options.template, {
      to: { subscriberId: SubscriberId, ...SubscriberData },
      payload: options.payload,
    }).catch((error) => {
      if (error.response.data.message === "workflow_not_found") {
        throw new Error(`Notification workflow template not found!`, {
          cause: error,
        });
      } else throw new Error(error.response.data.message, { cause: error });
    });
  }

  static async sendManyWithNovu(
    options: NovuManyTriggerOptions,
  ) {
    if (!options.subscriberIds.length) {
      throw new Error(`No subscriber id provided!`);
    }

    await Novu.trigger(options.template, {
      to: options.subscriberIds.map((subscriberId) => ({ subscriberId })),
      payload: options.payload,
    }).catch((error) => {
      if (error.response.data.message === "workflow_not_found") {
        throw new Error(`Notification workflow template not found!`, {
          cause: error,
        });
      } else throw new Error(error.response.data.message, { cause: error });
    });
  }
}
