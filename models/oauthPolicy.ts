import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const InputOauthPolicySchema = () =>
  e.object({
    role: e.string(),
    scopes: e.array(e.string()),
    subRoles: e.optional(e.array(e.string())),
    ttl: e.optional(e.number()),
  });

export const OauthPolicySchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
  }).extends(InputOauthPolicySchema);

export type TOauthPolicyInput = InputDocument<
  inferInput<typeof OauthPolicySchema>
>;
export type TOauthPolicyOutput = OutputDocument<
  inferOutput<typeof OauthPolicySchema>
>;

export const OauthPolicyModel = Mongo.model("oauthPolicy", OauthPolicySchema);

OauthPolicyModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

OauthPolicyModel.createIndex({ key: { role: 1 }, unique: true });
