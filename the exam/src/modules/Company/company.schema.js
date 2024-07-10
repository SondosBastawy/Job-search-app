import Joi from "joi";
import { objectIdRule } from "../../utils/general.rules.js";

export const createComSchema = {
  body: Joi.object({
    companyName: Joi.string().required().messages({
      "any.required": "company name is required",
      "string.min": "company name must be at least 3 characters long",
      "string.max": "company name must be at most 50 characters long",
    }),
    description: Joi.string().required().messages({
      "any.required": "company description is required",
      "string.min": "company description must be at least 3 characters long",
    }),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number()
      .integer()
      .min(11)
      .max(20)
      .required()
      .messages({
        "any.required": "number of employees is required",
        "number.min": "number of employees must be at least 11",
        "number.max": "number of employees must be at most 20",
      }),
    companyEmail: Joi.string().email().required().messages({
      "any.required": "company email is required",
      "string.email": "company email must be a valid email",
    }),
  }),
};
