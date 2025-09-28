import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { FileSchema } from "@Models/file.ts";
import { EmailValidator, PhoneValidator } from "@Models/user.ts";

export const InputAccountSchema = e.object({
  name: e.optional(e.string().max(50)),
  description: e.optional(e.string().max(300)),
  email: e.optional(EmailValidator()),
  phone: e.optional(PhoneValidator()),
});

export const AccountSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }), // Which User created this account?
  createdFor: e.instanceOf(ObjectId, { instantiate: true }), // Who is the owner of the account?
  logo: e.optional(FileSchema),
  isBlocked: e.optional(e.boolean()).default(false),
}).extends(InputAccountSchema);

export type TAccountInput = InputDocument<inferInput<typeof AccountSchema>>;
export type TAccountOutput = OutputDocument<inferOutput<typeof AccountSchema>>;

export const AccountModel = Mongo.model("account", AccountSchema);

AccountModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
