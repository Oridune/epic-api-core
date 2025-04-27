import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { Env, RequestMethod } from "@Core/common/mod.ts";

export const InputRequestLogsSchema = e.object({
  namespace: e.optional(e.string()),
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
    metadata: e.optional(e.record(e.any())),
    errorStack: e.any(),
    metrics: e.record(e.any()),
  }),
  errorStack: e.any(),
}, { allowUnexpectedProps: true });

export const RequestLogSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  account: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
}, { allowUnexpectedProps: true }).extends(InputRequestLogsSchema);

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
);

// TTL index to remove < 4xx status logs after specified days
RequestLogModel.createIndex(
  {
    key: { createdAt: 1 },
    expireAfterSeconds: 60 * 60 * 24 *
      (Env.numberSync("REQUEST_LOG_SUCCESS_RETENTION_DAYS") || 3), // 3 days default
    partialFilterExpression: { responseStatus: { $lt: 400 } },
    background: true,
  },
);

// TTL index to remove >= 4xx status logs after specified days
RequestLogModel.createIndex(
  {
    key: { createdAt: 1 },
    expireAfterSeconds: 60 * 60 * 24 *
      (Env.numberSync("REQUEST_LOG_FAILURE_RETENTION_DAYS") || 7), // 7 days default
    partialFilterExpression: { responseStatus: { $gte: 400 } },
    background: true,
  },
);
