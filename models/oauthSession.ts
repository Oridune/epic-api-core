import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { OauthScopeValidator } from "@Models/oauthPolicy.ts";

export enum OauthProvider {
  LOCAL = "local",
  PASSKEY = "passkey",
}

export const OauthAccessScopesValidator = e.record(
  e.array(OauthScopeValidator),
  { key: e.instanceOf(ObjectId, { instantiate: true }) },
);

export const OauthSessionSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  expiresAt: e.optional(e.date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  oauthApp: e.instanceOf(ObjectId, { instantiate: true }),
  useragent: e.optional(e.string()),
  version: e.number({ cast: true }),
  provider: e.in(Object.values(OauthProvider)),
  scopes: OauthAccessScopesValidator,
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

OauthSessionModel.createIndex({
  key: { createdBy: 1 },
  background: true,
});
