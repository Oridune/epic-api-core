import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";

export const CollaboratorSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    createdBy: e.instanceOf(ObjectId, { instantiate: true }),
    createdFor: e.instanceOf(ObjectId, { instantiate: true }),
    role: e.optional(e.string()).default("root"),
    isPrimary: e.boolean({ cast: true }),
    isOwned: e.boolean({ cast: true }),
    account: e.instanceOf(ObjectId, { instantiate: true }),
  });

export type TCollaboratorInput = InputDocument<
  inferInput<typeof CollaboratorSchema>
>;
export type TCollaboratorOutput = OutputDocument<
  inferOutput<typeof CollaboratorSchema>
>;

export const CollaboratorModel = Mongo.model(
  "collaborator",
  CollaboratorSchema
);

CollaboratorModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

CollaboratorModel.createIndex(
  {
    key: { createdFor: 1, account: 1 },
    background: true,
  },
  {
    key: { createdFor: 1, isPrimary: 1 },
    unique: true,
    background: true,
  }
);
