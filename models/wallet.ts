import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";

export const WalletSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    account: e.instanceOf(ObjectId, { instantiate: true }),
    type: e.string(),
    currency: e.string(),
    balance: e.number(),
    digest: e.string(),
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
