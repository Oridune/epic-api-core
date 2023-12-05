import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";

export enum ApiKeyStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export const ApiKeySchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    secret: e.string(),
    status: e.in(Object.values(ApiKeyStatus)),
  });

export type TApiKeyInput = InputDocument<inferInput<typeof ApiKeySchema>>;
export type TApiKeyOutput = OutputDocument<inferOutput<typeof ApiKeySchema>>;

export const ApiKeyModel = Mongo.model("apiKey", ApiKeySchema);

ApiKeyModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
