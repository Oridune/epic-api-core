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

export const PasswordFormatValidator = (
  t: TFunction,
  strength: 0 | 1 | 2 = 2,
  minLength = 8,
  maxLength = 260,
) => {
  const PasswordLevels = [
    [
      "A password should be {{length}} characters long, must contain a character and a number!",
      `^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d\\S]{${minLength},${maxLength}}$`,
    ],
    [
      "A password should be {{length}} characters long, must contain an uppercase, a lowercase and a number!",
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{${minLength},${maxLength}}$`,
    ],
    [
      "A password should be {{length}} characters long, must contain an uppercase, a lowercase, a number and a special character!",
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{${minLength},${maxLength}}$`,
    ],
  ];

  return e.string({
    messages: {
      matchFailed: t(
        PasswordLevels[strength][0],
        { length },
      ),
    },
  }).matches({ regex: new RegExp(PasswordLevels[strength][1]) });
};

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
      regex: /^0[0-9]{8,12}$/,
    });

export const EmailValidator = (t: TFunction) =>
  e
    .string({
      messages: { matchFailed: t("Please provide a valid email!") },
    })
    .matches({
      regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
    });
