import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const TransactionSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    sessionId: e.optional(e.string()),
    reference: e.string(),
    fromName: e.string(),
    from: e.instanceOf(ObjectId, { instantiate: true }),
    sender: e.instanceOf(ObjectId, { instantiate: true }),
    toName: e.string(),
    to: e.instanceOf(ObjectId, { instantiate: true }),
    receiver: e.instanceOf(ObjectId, { instantiate: true }),
    type: e.string(),
    description: e.optional(e.string()),
    tags: e.optional(e.array(e.string())),
    currency: e.string(),
    amount: e.number({ cast: true }),
    status: e.in(Object.values(TransactionStatus)),
    methodOf3DSecurity: e.optional(e.string()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    metadata: e.optional(e.record(e.any)),
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
