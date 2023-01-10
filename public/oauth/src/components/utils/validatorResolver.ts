import { Resolver } from "react-hook-form";
import {
  ValidationException,
  IValidationIssue,
  BaseValidator,
  InferOutput,
} from "@oridune/validator";

export const ValidatorResolver =
  <S extends BaseValidator<any, any, any>>(
    schema: S,
    location?: string
  ): Resolver<InferOutput<S>> =>
  async (values) => {
    const Errors: Record<string, IValidationIssue> = {};

    try {
      values = await schema.validate(values, { location });
    } catch (error) {
      if (error instanceof ValidationException)
        error.issues.forEach((issue) => {
          if (issue.location)
            Errors[
              issue.location.replace(
                location ? new RegExp(`^${location}\\.`) : "input.",
                ""
              )
            ] = issue;
        });
    }

    return { values, errors: Errors };
  };
