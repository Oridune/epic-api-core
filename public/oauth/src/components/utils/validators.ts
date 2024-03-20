import e from "@oridune/validator";
import { TFunction } from "i18next";

export const UsernameValidator = (t: TFunction) =>
  e
    .string({
      messages: {
        matchFailed: t("Please provide a valid username format!"),
      },
    })
    .matches(/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
    .length(50);

export const PasswordFormatValidator = (t: TFunction) =>
  e
    .string({
      messages: {
        matchFailed: t(
          "A password should be 8 characters long, must contain an uppercase, a lowercase, a number and a special character!",
        ),
      },
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?|\s])[A-Za-z\d!@#$%^&*()_\-+=?|\s]{8,}$/,
    );

export const PasswordValidator = (t: TFunction) =>
  e
    .string({
      messages: {
        typeError: t("Please provide a valid password!"),
        smallerLength: t("Password is required!"),
      },
    })
    .length({ min: 1, max: 300 });

export const PhoneValidator = (t: TFunction) =>
  e
    .string({
      messages: { matchFailed: t("Please provide a valid phone!") },
    })
    .matches({
      regex: /^\+[0-9]{6,14}$/,
    });

export const EmailValidator = (t: TFunction) =>
  e
    .string({
      messages: { matchFailed: t("Please provide a valid email!") },
    })
    .matches({
      regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
    });
