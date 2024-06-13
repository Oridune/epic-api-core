import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export enum OauthProvider {
  LOCAL = "local",
  PASSKEY = "passkey",
}

export const OauthSessionSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    expiresAt: e.optional(e.date()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    oauthApp: e.instanceOf(ObjectId, { instantiate: true }),
    useragent: e.optional(e.string()),
    version: e.number({ cast: true }),
    provider: e.in(Object.values(OauthProvider)),
    scopes: e.record(e.array(e.string().matches(/\w+(\.\w+)*|^\*$/)), {
      cast: true,
    }),
  });

export type TOauthSessionInput = InputDocument<
  inferInput<typeof OauthSessionSchema>
>;
export type TOauthSessionOutput = OutputDocument<
  inferOutput<typeof OauthSessionSchema>
>;

export const OauthSessionModel = Mongo.model(
  "oauthSession",
  OauthSessionSchema,
);

OauthSessionModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
