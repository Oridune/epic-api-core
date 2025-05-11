import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const InputRequestLogIgnoreSchema = e.object({
  method: e.optional(e.array(e.string())),
  url: e.optional(e.string()),
  responseStatus: e.optional(e.tuple([e.number(), e.number()])),
});

export const RequestLogIgnoreSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  account: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
}).extends(InputRequestLogIgnoreSchema);

export type TRequestLogIgnoreInput = InputDocument<
  inferInput<typeof RequestLogIgnoreSchema>
>;
export type TRequestLogIgnoreOutput = OutputDocument<
  inferOutput<typeof RequestLogIgnoreSchema>
>;

export const RequestLogIgnoreModel = Mongo.model(
  "requestLogIgnore",
  RequestLogIgnoreSchema,
);

RequestLogIgnoreModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
