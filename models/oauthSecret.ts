import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { OauthAccessScopesValidator } from "@Models/oauthSession.ts";

export const OauthSecretSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  expiresAt: e.optional(e.date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  oauthApp: e.instanceOf(ObjectId, { instantiate: true }),
  name: e.string().min(2).max(300),
  scopes: OauthAccessScopesValidator,
  isBlocked: e.optional(e.boolean({ cast: true })).default(false),
});

export type TOauthSecretInput = InputDocument<
  inferInput<typeof OauthSecretSchema>
>;
export type TOauthSecretOutput = OutputDocument<
  inferOutput<typeof OauthSecretSchema>
>;

export const OauthSecretModel = Mongo.model("oauthSecret", OauthSecretSchema);

OauthSecretModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
