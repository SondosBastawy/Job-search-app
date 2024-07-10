import jwt from "jsonwebtoken";

import { User } from "../../database/models/user.model.js";
import { ErrorHandleClass } from "../utils/error.class.util.js";

/**
 * Middleware to authenticate requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

export const authMiddleWare = () => {
  return async (req, res, next) => {
    try {
      //  check for a token in the request headers
      const { token } = req.headers;
      if (!token)
        return res
          .status(401)
          .json({ message: "Authorization token required, please signin first" });
    // Validate token format 
    if (!token.startsWith("seem")) {
        return next(new ErrorHandleClass("this token is not correct"));
      }
      //   get the original token
      const splittedToken = token.split(" ")[1];
      //   decode token
      const decodedToken = jwt.verify(splittedToken, process.env.LOGIN_SECRET);
      if (!decodedToken?.userId) {
        return next(new ErrorHandleClass("invalid token payload"));
      }
      // find user by userId
      const isUserExists = await User.findById(decodedToken?.userId);
      if (!isUserExists) {
        return next(
          new ErrorHandleClass("User not found", 404, "User not found")
        );
      }
      // add the user data in req object
      req.authUser = isUserExists;
      next();
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ message: "some thing went wrong" });
    }
  };
};
