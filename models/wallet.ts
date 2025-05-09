import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const WalletSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  account: e.instanceOf(ObjectId, { instantiate: true }),
  type: e.string(),
  currency: e.string(),
  balance: e.number(),
  digest: e.string(),
  lastBalance: e.optional(e.number()),
  lastTxnReference: e.optional(e.string()),
  negativeAt: e.optional(e.or([e.date(), e.null()])),
});

export type TWalletInput = InputDocument<inferInput<typeof WalletSchema>>;
export type TWalletOutput = OutputDocument<inferOutput<typeof WalletSchema>>;

export const WalletModel = Mongo.model("wallet", WalletSchema);

WalletModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

WalletModel.createIndex({ key: { account: 1 }, background: true });
