import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const InputWalletAddressSchema = e.object({
  name: e.string().max(50),
  accountName: e.string().max(50),
  address: e.string().max(256),
  lastTransferAmount: e.optional(e.number()),
});

export const WalletAddressSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
}).extends(InputWalletAddressSchema);

export type TWalletAddressInput = InputDocument<
  inferInput<typeof WalletAddressSchema>
>;
export type TWalletAddressOutput = OutputDocument<
  inferOutput<typeof WalletAddressSchema>
>;

export const WalletAddressModel = Mongo.model(
  "walletAddress",
  WalletAddressSchema,
);

WalletAddressModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

WalletAddressModel.createIndex({
  key: {
    createdBy: 1,
    address: 1,
  },
  unique: true,
  background: true,
});
