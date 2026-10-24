import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const OauthScopeValidator = e.string().matches(/\w+(\.\w+)*|^\*$/);

export const InputOauthPolicySchema = e.object({
  role: e.string(),
  scopes: e.array(OauthScopeValidator),
  subRoles: e.optional(e.array(e.string())),
  ttl: e.optional(e.number()),
});

// The layout content is owned by the frontend; only the envelope is checked.
export const OauthPolicyLayoutConfigSchema = e.object(
  { schemaVersion: e.number().int().min(1) },
  { allowUnexpectedProps: true },
).custom((ctx) => {
  if (new TextEncoder().encode(JSON.stringify(ctx.output)).length > 32 * 1024) {
    throw new Error("Layout config must not exceed 32 KB!");
  }
});

export const OauthPolicySchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  layout: e.optional(e.or([
    e.object({
      config: OauthPolicyLayoutConfigSchema,
      updatedBy: e.instanceOf(ObjectId, { instantiate: true }),
      updatedAt: e.date(),
    }),
    e.null(),
  ])),
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
