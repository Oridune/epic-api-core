import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const TransactionSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  sessionId: e.optional(e.string()),
  reference: e.string(),
  fromName: e.string(),
  from: e.instanceOf(ObjectId, { instantiate: true }),
  toName: e.string(),
  to: e.instanceOf(ObjectId, { instantiate: true }),
  type: e.string(),
  description: e.optional(e.string()),
  currency: e.string(),
  amount: e.number({ cast: true }),
  status: e.in(Object.values(TransactionStatus)),
  is3DVerified: e.optional(e.boolean({ cast: true })).default(false),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
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

await TransactionModel.createIndex(
  {
    key: { sessionId: 1 },
    unique: true,
    partialFilterExpression: { sessionId: { $exists: true } },
    background: true,
  },
  {
    key: { reference: 1 },
    unique: true,
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
    key: {
      reference: "text",
      fromName: "text",
      toName: "text",
      description: "text",
    },
    background: true,
  }
);
