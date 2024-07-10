import Joi from "joi";
import { generalRules } from "../../utils/general.rules.js";

export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().messages({
      "any.required": "You need to enter your first name",
    }),
    lastName: Joi.string().min(3).max(30).alphanum().messages({
      "any.required": "You need to enter your last name",
    }),
    email: generalRules.email,
    mobileNumber: Joi.string()
      .min(10)
      .max(15)
      .regex(/^[0-9]+$/)
      .messages({
        "any.required": "you need to enter your mobile Number",
      }),
    recoveryEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ["net", "com"] },
      })
      .messages({
        "any.required": "you need to enter your email",
      }),
    DOB: Joi.date().iso().messages({
      "any.required": "you need to enter your DOB",
      "date.format": "please enter the correct YYYY-MM-DD",
    }),
    role: Joi.string().valid("user", "CompanyHR"),
    password: generalRules.password,
  }).options({ presence: "required" }),
};
