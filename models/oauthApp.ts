import e, { inferInput, inferOutput } from "validator";
import { InputDocument, Mongo, ObjectId, OutputDocument } from "mongo";
import { FileSchema } from "@Models/file.ts";
import { IdentificationMethod } from "@Controllers/usersIdentification.ts";

export const OauthConsentStylingSchema = e.object({
  roundness: e.optional(
    e.number({ cast: true }).amount({ min: 0, max: 100 }),
  ),
});

export const OauthConsentSchema = e.object({
  passkeyEnabled: e.optional(e.boolean()),
  availableCountryCodes: e.optional(
    e.array(e.string().length({ min: 2, max: 2 }), { cast: true }).min(1),
  ),
  requiredIdentificationMethods: e.optional(
    e.array(e.in(Object.values(IdentificationMethod)), { cast: true }).min(1),
  ).default([IdentificationMethod.EMAIL]),
  logo: e.optional(FileSchema),
  primaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  primaryColorDark: e.optional(
    e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  ),
  secondaryColor: e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  secondaryColorDark: e.optional(
    e.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  ),
  styling: e.optional(OauthConsentStylingSchema),
  passwordPolicy: e.optional(e.object({
    strength: e.optional(e.number().min(0).max(2)),
    minLength: e.optional(e.number().min(6)),
    maxLength: e.optional(e.number().min(6)),
  })),
  allowedCallbackURLs: e
    .array(
      e.string().custom((ctx) => new URL(ctx.output).toString()),
      { cast: true, splitter: /\s*,\s*/ },
    )
    .min(1),
  homepageURL: e.string().custom((ctx) => new URL(ctx.output).toString()),
  privacyPolicyURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
  ),
  termsAndConditionsURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
  ),
  supportURL: e.optional(
    e.string().custom((ctx) => new URL(ctx.output).toString()),
  ),
});

export enum SupportedIntegrationId {
  RECAPTCHA_V3 = "re-captcha-v3",
}

export const OauthIntegrationSchema = e.object({
  id: e.in(Object.values(SupportedIntegrationId)),
  enabled: e.optional(e.boolean()).default(true),
  publicKey: e.optional(e.string()),
  secretKey: e.optional(e.string()),
  props: e.optional(e.record(e.string())),
});

export const InputOauthAppSchema = e.object({
  name: e.string().length({ min: 2, max: 50 }),
  description: e.optional(e.string().length({ min: 30, max: 300 })),
  enabled: e.optional(e.boolean({ cast: true })).default(true),
  consent: OauthConsentSchema,
  integrations: e.optional(e.array(OauthIntegrationSchema)),
  metadata: e.optional(e.record(e.string())),
});

export const OauthAppSchema = e.object({
  _id: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdAt: e.optional(e.date()).default(() => new Date()),
  updatedAt: e.optional(e.date()).default(() => new Date()),
  account: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
  createdBy: e.optional(e.instanceOf(ObjectId, { instantiate: true })),
}).extends(InputOauthAppSchema);

export type TOauthAppInput = InputDocument<inferInput<typeof OauthAppSchema>>;
export type TOauthAppOutput = OutputDocument<
  inferOutput<typeof OauthAppSchema>
>;

export const OauthAppModel = Mongo.model("oauthApp", OauthAppSchema);

OauthAppModel.pre("update", (details) => {
  details.updates.$set = {
    ...details.updates.$set,
    updatedAt: new Date(),
  };
});
