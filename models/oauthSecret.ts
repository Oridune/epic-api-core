import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export enum OauthSecretStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export const OauthSecretSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    expiresAt: e.optional(e.date()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    oauthApp: e.instanceOf(ObjectId, { instantiate: true }),
    name: e.string().min(2).max(300),
    scopes: e.record(e.array(e.string().matches(/\w+(\.\w+)*|^\*$/)), {
      cast: true,
    }),
    status: e.optional(e.in(Object.values(OauthSecretStatus))).default(
      OauthSecretStatus.ACTIVE,
    ),
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
