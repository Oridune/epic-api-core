import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export enum TransactionStatus {
  COMPLETED = "completed",
}

export const TransactionSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  sessionId: e.optional(e.string()),
  reference: e.string(),
  foreignRefType: e.optional(e.string()),
  foreignRef: e.optional(e.string()),
  fromName: e.string(),
  from: e.instanceOf(ObjectId, { instantiate: true }),
  sender: e.instanceOf(ObjectId, { instantiate: true }),
  toName: e.string(),
  to: e.instanceOf(ObjectId, { instantiate: true }),
  receiver: e.instanceOf(ObjectId, { instantiate: true }),
  type: e.string(),
  description: e.optional(e.or([e.record(e.string()), e.string()])),
  tags: e.optional(e.array(e.string())),
  currency: e.string(),
  amount: e.number({ cast: true }),
  methodOf3DSecurity: e.optional(e.string()),
  status: e.optional(e.in(Object.values(TransactionStatus))).default(
    TransactionStatus.COMPLETED,
  ),
  isRefund: e.optional(e.boolean()), // Indicates this transaction is a refund received (Received).
  isRefunded: e.optional(e.boolean()), // Indicates this transaction has been refunded (Sent).
  metadata: e.optional(e.record(e.or([e.number(), e.boolean(), e.string()]))),
});

export type TTransactionInput = InputDocument<
  inferInput<typeof TransactionSchema>
>;
export type TTransactionOutput = OutputDocument<
  inferOutput<typeof TransactionSchema>
>;

export const TransactionModel = Mongo.model("transaction", TransactionSchema);

TransactionModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

TransactionModel.createIndex(
  {
    key: { sessionId: 1 },
    unique: true,
    partialFilterExpression: { sessionId: { $type: "string" } },
    background: true,
  },
  {
    key: { reference: 1 },
    unique: true,
    background: true,
  },
  {
    key: { foreignRefType: 1 },
    background: true,
  },
  {
    key: { foreignRef: 1 },
    background: true,
  },
  {
    key: { from: 1 },
    background: true,
  },
  {
    key: { to: 1 },
    background: true,
  },
  {
    key: { tags: 1 },
    background: true,
  },
  {
    key: {
      reference: "text",
      fromName: "text",
      toName: "text",
      description: "text",
      tags: "text",
    },
    background: true,
  },
);
