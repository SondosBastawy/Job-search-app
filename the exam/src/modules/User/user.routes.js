import { Router } from "express";

import {
  deleteAccount,
  getAccountData,
  getAllAccounts,
  getProfile,
  signIn,
  signUp,
  updateData,
  resetPassword,
  updatePassword,
  forgetPassword,
} from "./user.controller.js";
import { authMiddleWare } from "../../middlewares/auth.middleware.js";
import { errorHandle } from "../../middlewares/errorHandling.middleware.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import { SignUpSchema } from "./user.schema.js";

const userRouter = Router();

userRouter.post(
  "/signup",
  validationMiddleWare(SignUpSchema),
  errorHandle(signUp)
);
userRouter.post("/signin", errorHandle(signIn));
userRouter.patch("/update", authMiddleWare(), errorHandle(updateData));
userRouter.delete("/delete", authMiddleWare(), errorHandle(deleteAccount));
userRouter.patch(
  "/updatePassword",
  authMiddleWare(),
  errorHandle(updatePassword)
);
userRouter.patch(
  "/updatePassword",
  authMiddleWare(),
  errorHandle(forgetPassword)
);
userRouter.patch(
  "/resetPassword",
  authMiddleWare(),
  errorHandle(resetPassword)
);
userRouter.get("/getUserData", authMiddleWare(), errorHandle(getAccountData));
userRouter.get("/getProfile", errorHandle(getProfile));
userRouter.get("/getAll", authMiddleWare(), errorHandle(getAllAccounts));

export default userRouter;
