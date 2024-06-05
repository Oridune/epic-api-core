import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { RequestMethod } from "@Core/common/mod.ts";

export const InputRequestLogsSchema = e.object({
  namespace: e.string(),
  requestId: e.string(),
  method: e.in(Object.values(RequestMethod)),
  url: e.string(),
  headers: e.record(e.string()),
  body: e.optional(e.any()),
  auth: e.optional(
    e.partial(
      e.object({
        secretId: e.optional(e.string()),
        sessionId: e.optional(e.string()),
        userId: e.string(),
        accountId: e.string(),
        isAccountOwned: e.boolean(),
        isAccountPrimary: e.boolean(),
        role: e.string(),
        accountRole: e.string(),
        resolvedRole: e.string(),
      }, { allowUnexpectedProps: true }),
    ),
  ),
  responseStatus: e.number(),
  response: e.object({
    status: e.boolean(),
    messages: e.any(),
    data: e.any(),
    metrics: e.record(e.any()),
  }),
});

export const RequestLogSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  account: e.instanceOf(ObjectId, { instantiate: true }),
}).extends(InputRequestLogsSchema);

export type TRequestLogInput = InputDocument<
  inferInput<typeof RequestLogSchema>
>;
export type TRequestLogOutput = OutputDocument<
  inferOutput<typeof RequestLogSchema>
>;

export const RequestLogModel = Mongo.model(
  "requestLog",
  RequestLogSchema,
);

RequestLogModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

RequestLogModel.createIndex(
  {
    key: { requestId: 1 },
    unique: true,
    background: true,
  },
  {
    key: { createdAt: 1 },
    expireAfterSeconds: 60 * 60 * 24 * 7, // Log retention 7 days
    background: true,
  },
);
