import e, { inferInput, inferOutput } from "validator";
import { Mongo, ObjectId, InputDocument, OutputDocument } from "mongo";
import { FileSchema } from "@Models/file.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";

export const OauthConsentStylingSchema = () =>
  e.object({
    roundness: e.optional(
      e.number({ cast: true }).amount({ min: 0, max: 100 })
    ),
  });

export const OauthConsentSchema = () =>
  e.object({
    availableCountryCodes: e.optional(
      e
        .array(e.string().length({ min: 2, max: 2 }), {
          cast: true,
        })
        .min(1)
    ),
    requiredIdentificationMethods: e
      .optional(
        e
          .array(e.in(Object.values(IdentificationMethod)), { cast: true })
          .min(1)
      )
      .default([IdentificationMethod.EMAIL]),
    logo: e.optional(FileSchema),
    primaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    primaryColorDark: e.optional(
      e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    ),
    secondaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    secondaryColorDark: e.optional(
      e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    ),
    styling: e.optional(OauthConsentStylingSchema),
    allowedCallbackURLs: e
      .array(
        e.string().custom((ctx) => new URL(ctx.output).toString()),
        { cast: true, splitter: /\s*,\s*/ }
      )
      .min(1),
    homepageURL: e.string().custom((ctx) => new URL(ctx.output).toString()),
    privacyPolicyURL: e.optional(
      e.string().custom((ctx) => new URL(ctx.output).toString())
    ),
    termsAndConditionsURL: e.optional(
      e.string().custom((ctx) => new URL(ctx.output).toString())
    ),
    supportURL: e.optional(
      e.string().custom((ctx) => new URL(ctx.output).toString())
    ),
  });

export const OauthAppSchema = () =>
  e.object({
    _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdAt: e.optional(e.date()).default(() => new Date()),
    updatedAt: e.optional(e.date()).default(() => new Date()),
    account: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    createdBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
    name: e.string().length({ min: 2, max: 50 }),
    description: e.optional(e.string().length({ min: 30, max: 300 })),
    enabled: e.optional(e.boolean({ cast: true })).default(true),
    consent: OauthConsentSchema,
    metadata: e.optional(e.record(e.string())),
  });

export type TOauthAppInput = InputDocument<inferInput<typeof OauthAppSchema>>;
export type TOauthAppOutput = OutputDocument<
  inferOutput<typeof OauthAppSchema>
>;

export const OauthAppModel = Mongo.model("oauth-app", OauthAppSchema);

OauthAppModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
