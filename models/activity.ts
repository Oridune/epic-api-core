import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

export const ActivitySchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  subject: e.optional(e.string()),
  payload: e.any(),
});

export type TActivityInput = InputDocument<inferInput<typeof ActivitySchema>>;
export type TActivityOutput = OutputDocument<
  inferOutput<typeof ActivitySchema>
>;

export const ActivityModel = Mongo.model("activity", ActivitySchema);

ActivityModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
