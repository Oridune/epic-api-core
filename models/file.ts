import e, { inferInput, inferOutput } from "validator";
import { InputDocument } from "mongo";

export const FileSchema = e.object({
  name: e.optional(e.string()),
  url: e.string(),
  mimeType: e.optional(e.string()),
  sizeInBytes: e.optional(e.number({ cast: true })),
  alt: e.optional(e.string()),
});

export type TFileInput = InputDocument<inferInput<typeof FileSchema>>;
export type TFileOutput = InputDocument<inferOutput<typeof FileSchema>>;
