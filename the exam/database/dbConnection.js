import mongoose from "mongoose";

export const dbConnection = async () => {
  await mongoose
    .connect(process.env.CONNECTION_DB_URI)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch(() => {
      console.log("connection failed");
    });
};
