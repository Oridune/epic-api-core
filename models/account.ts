import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";
import { FileSchema } from "@Models/file.ts";

export const InputAccountSchema = () =>
  e.object({
    name: e.optional(e.string()),
    description: e.optional(e.string()),
  });

export const AccountSchema = () =>
  e
    .object({
      _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
      createdAt: e.optional(e.date()).default(() => new Date()),
      updatedAt: e.optional(e.date()).default(() => new Date()),
      createdBy: e.instanceOf(ObjectId, { instantiate: true }), // Which User created this account?
      createdFor: e.instanceOf(ObjectId, { instantiate: true }), // Who is the owner of the account?
      logo: e.optional(FileSchema),
      isBlocked: e.optional(e.boolean()).default(false),
    })
    .extends(InputAccountSchema);

export type TAccountInput = InputDocument<inferInput<typeof AccountSchema>>;
export type TAccountOutput = OutputDocument<inferOutput<typeof AccountSchema>>;

export const AccountModel = Mongo.model("account", AccountSchema);

AccountModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
