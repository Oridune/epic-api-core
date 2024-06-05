import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const InputEnvSchema = e.object({
  key: e.string(),
  value: e.string(),
  ttl: e.optional(e.number()),
});

export const EnvSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
}).extends(InputEnvSchema);

export type TEnvInput = InputDocument<inferInput<typeof EnvSchema>>;
export type TEnvOutput = OutputDocument<inferOutput<typeof EnvSchema>>;

export const EnvModel = Mongo.model("env", EnvSchema);

EnvModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
