import Joi from "joi";
import { Types } from "mongoose";

export const objectIdRule = (value, helper) => {
  const isObjectValid = Types.ObjectId.isValid(value);
  return isObjectValid ? value : helper.message("invalid object Id ");
};

export const generalRules = {
  objectId: Joi.string().custom(objectIdRule),
  headers: {
    "content-type": Joi.string().optional(),
    accept: Joi.string().valid("application/json").optional(),
    "accept-encoding": Joi.string().optional(),
    host: Joi.string().optional(),
    "content-length": Joi.string().optional(),
    "user-agent": Joi.string().optional(),
    "accept-language": Joi.string().optional(),
    "accept-charset": Joi.string().optional(),
    "postman-token": Joi.string().optional(),
    "postman-id": Joi.string().optional(),
  },
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{6,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least one lowercase letter, one uppercase letter, one number and one special character and more that 6 characters",
      "any.required": "You need to provide a password",
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["net", "com"] },
    })
    .messages({
      "any.required": "you need to enter your email",
    }),
};
