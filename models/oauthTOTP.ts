import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export enum TotpStatus {
  PENDING = "pending",
  ACTIVE = "active",
}

export const OauthTotpSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  payload: e.object({
    issuer: e.string(),
    label: e.string(),
    secret: e.string(),
  }),
  status: e.optional(e.in(Object.values(TotpStatus))).default(
    TotpStatus.PENDING,
  ),
});

export type TOauthTotpInput = InputDocument<
  inferInput<typeof OauthTotpSchema>
>;
export type TOauthTotpOutput = OutputDocument<
  inferOutput<typeof OauthTotpSchema>
>;

export const OauthTotpModel = Mongo.model(
  "oauthTotp",
  OauthTotpSchema,
);

OauthTotpModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

OauthTotpModel.createIndex(
  {
    name: "uniqueTOTP",
    key: { createdBy: 1, status: 1 },
    partialFilterExpression: { status: TotpStatus.ACTIVE },
    unique: true,
    background: true,
  },
);

OauthTotpModel.createIndex(
  {
    name: "removeUnused",
    key: { createdAt: 1 },
    expireAfterSeconds: 60 * 60, // 1 hour
    partialFilterExpression: { status: TotpStatus.PENDING },
    background: true,
  },
);
