import mongoose from "mongoose";
const { Schema, model } = mongoose;

const appSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userTechSkills: {
      type: [String],
      default: [],
    },
    userSoftSkills: {
      type: [String],
      default: [],
    },
    userResume: {
      type: String,
      required: true,
    },
  },
  { timestamps: { updatedAt: false }, versionKey: false }
);

export const Application = model("Application", appSchema);
