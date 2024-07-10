import { Schema, model } from "mongoose";

import { systemRoles } from "../../src/utils/system.roles.js";

systemRoles;

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unqiue: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      trim: true,
      required: false,
      unique: false,
    },
    mobileNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(systemRoles), // ['user', 'HR']
    },
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline"], // Optional: Enforce valid statuses
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    DOB: {
      type: Date,
      required: true,
    },
    otp: String,
    otpExpiration: String,
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

export const User = model("User", schema);
