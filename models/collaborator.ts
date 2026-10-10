import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";

/**
 * Renewal period in days. `null` means the access never expires, an absent
 * value leaves the period up to the host app.
 */
export const AccessDaysValidator = () =>
  e.optional(e.or([e.null(), e.number().int().min(1).max(365)]));

export const CollaboratorSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  createdBy: e.instanceOf(ObjectId, { instantiate: true }),
  createdFor: e.instanceOf(ObjectId, { instantiate: true }),
  role: e.optional(e.string()).default("root"),
  isOwned: e.boolean({ cast: true }),
  isPrimary: e.boolean({ cast: true }),
  account: e.instanceOf(ObjectId, { instantiate: true }),
  isBlocked: e.optional(e.boolean()).default(false),

  /** Access ends at this instant. Unset means it never expires. */
  expiresAt: e.optional(e.date()),
  accessDays: AccessDaysValidator(),

  /** Written by the host app: the last in person renewal. */
  renewedAt: e.optional(e.date()),
  renewedBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),

  /** Written by the host app: the `expiresAt` it last warned about. */
  expiryWarnedFor: e.optional(e.date()),
});

export type TCollaboratorInput = InputDocument<
  inferInput<typeof CollaboratorSchema>
>;
export type TCollaboratorOutput = OutputDocument<
  inferOutput<typeof CollaboratorSchema>
>;

export const CollaboratorModel = Mongo.model(
  "collaborator",
  CollaboratorSchema,
);

CollaboratorModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});

CollaboratorModel.createIndex(
  {
    key: { account: 1 },
    background: true,
  },
  {
    key: { createdFor: 1, account: 1 },
    background: true,
  },
  {
    key: { createdFor: 1, isPrimary: 1 },
    unique: true,
    partialFilterExpression: { isPrimary: true },
    background: true,
  },
  {
    // Partial: almost no collaborator carries an expiry.
    key: { expiresAt: 1 },
    partialFilterExpression: { expiresAt: { $exists: true } },
    background: true,
  },
);
