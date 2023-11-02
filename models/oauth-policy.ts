import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";

export const OauthPolicySchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  role: e.string(),
  scopes: e.array(e.string()),
});

export type TOauthPolicyInput = InputDocument<
  inferInput<typeof OauthPolicySchema>
>;
export type TOauthPolicyOutput = OutputDocument<
  inferOutput<typeof OauthPolicySchema>
>;

export const OauthPolicyModel = Mongo.model("oauth-policy", OauthPolicySchema);

OauthPolicyModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

await OauthPolicyModel.createIndex({ key: { role: 1 }, unique: true });
