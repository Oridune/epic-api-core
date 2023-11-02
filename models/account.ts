import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";
import { FileSchema } from "@Models/file.ts";

export const AccountSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  createdFor: e.instanceOf(ObjectId, { instantiate: true }),
  name: e.optional(e.string()),
  description: e.optional(e.string()),
  logo: e.optional(FileSchema),
  isBlocked: e.optional(e.boolean()).default(false),
});

export type TAccountInput = InputDocument<inferInput<typeof AccountSchema>>;
export type TAccountOutput = OutputDocument<inferOutput<typeof AccountSchema>>;

export const AccountModel = Mongo.model("account", AccountSchema);

AccountModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
