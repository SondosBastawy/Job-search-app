import { ErrorHandleClass } from "../utils/error.class.util.js";

// validation middleware

const reqKeys = ["body", "headers", "params", " query"];

// validation middleware for all requests
export const validationMiddleWare = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    for (const key of reqKeys) {
      // Validate the request data against the schema of the same key
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });

      // If there is an error, push the error details to the validationErrors array
      if (validationResult?.error) {
        validationErrors.push(validationResult?.error?.details);
      }
    }

    // If there are validation errors, return the error response  with the validation errors
    validationErrors.length
      ? next(new ErrorHandleClass("Validation Error", 400, validationErrors))
      : next();
  };
};
