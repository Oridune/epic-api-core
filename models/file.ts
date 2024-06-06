import e, { inferInput, inferOutput } from "validator";
import { InputDocument, ObjectId } from "mongo";

export const FileSchema = e.object({
  _id: e
    .optional(e.instanceOf(ObjectId, { instantiate: true }))
    .default(() => new ObjectId()),
  createdBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  name: e.optional(e.string()),
  url: e.string(),
  mimeType: e.optional(e.string()),
  sizeInBytes: e.optional(e.number({ cast: true })),
  alt: e.optional(e.string()),
});

export type TFileInput = InputDocument<inferInput<typeof FileSchema>>;
export type TFileOutput = InputDocument<inferOutput<typeof FileSchema>>;
