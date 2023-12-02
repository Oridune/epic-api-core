import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";
import {
  EmailValidator,
  PhoneValidator,
  UsernameValidator,
} from "@Models/user.ts";

export const AccountInviteSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    recipient: e.or([EmailValidator, UsernameValidator, PhoneValidator]),
    role: e.string(),
    account: e.instanceOf(ObjectId, { instantiate: true }),
    token: e.optional(e.string()).default(() => crypto.randomUUID()),
  });

export type TAccountInviteInput = InputDocument<
  inferInput<typeof AccountInviteSchema>
>;
export type TAccountInviteOutput = OutputDocument<
  inferOutput<typeof AccountInviteSchema>
>;

export const AccountInviteModel = Mongo.model(
  "account-invite",
  AccountInviteSchema
);

AccountInviteModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
}).createIndex({ key: { token: 1 }, background: true });
