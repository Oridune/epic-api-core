import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";
import { EnvType } from "@Core/common/env.ts";

export const EnvSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  type: e.optional(e.or([e.in(Object.values(EnvType)), e.string(), e.null()])),
  key: e.string(),
  value: e.string(),
});

export type TEnvInput = InputDocument<inferInput<typeof EnvSchema>>;
export type TEnvOutput = OutputDocument<inferOutput<typeof EnvSchema>>;

export const EnvModel = Mongo.model("env", EnvSchema);

EnvModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
