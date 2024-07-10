import Joi from "joi";
import { objectIdRule } from "../../utils/general.rules.js";

export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required().messages({
      "any.required": "job title is required",
    }),
    jobLocation: Joi.string()
      .optional()
      .valid("onsite", "remotely", "hybrid")
      .messages({
        "any.required": "job location is required",
      }),
    workingTime: Joi.string()
      .required()
      .valid("part-time", "full-time")
      .messages({
        "any.required": "working time is required",
      }),
    seniorityLevel: Joi.string()
      .required()
      .valid("Junior", "CTO", "Senior", "Mid-Level", "Team-Lead"),
    jobDescription: Joi.string().required().messages({
      "any.required": "job description is required",
    }),
    technicalSkills: Joi.array().items(Joi.string()).required().messages({
      "any.required": "technical skills are required",
    }),
    softSkills: Joi.array().items(Joi.string()).required().messages({
      "any.required": "soft skills are required",
    }),
    addedBy: Joi.string().email().custom(objectIdRule),
  }),
};
