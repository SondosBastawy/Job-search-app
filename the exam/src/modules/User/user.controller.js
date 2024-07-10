import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../../../database/models/user.model.js";
import { sendEmailService } from "../../services/sendemail.service.js";
import { ErrorHandleClass } from "../../utils/error.class.util.js";

const signUp = async (req, res, next) => {
  // destruct data from req.body
  const {
    firstName,
    lastName,
    email,
    recoveryEmail,
    password,
    DOB,
    mobileNumber,
    role,
  } = req.body;
  // email check
  const isFound = await User.findOne({ email });
  if (isFound)
    return next(
      new ErrorHandleClass(
        "Email already exist",
        409,
        "email is already exist "
      )
    );

  // hash password
  const hashPassword = hashSync(password, +process.env.SALT_ROUNDS);

  // create user
  const userObject = {
    firstName,
    lastName,
    userName: firstName + lastName,
    email,
    DOB,
    password: hashPassword,
    recoveryEmail,
    mobileNumber,
    role,
  };
  let user = await User.create(userObject);
  // Return user without password (using a temporary variable)
  const userToReturn = { ...user._doc }; // Create a copy using user._doc
  // Remove password from the copy
  delete userToReturn.password;
  res
    .status(201)
    .json({ message: "User created successfully!", user: userToReturn });
};
// ***************************************************************

/**
 * Sign in function to authenticate user login.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} The JSON response with a token if successful.
 */
const signIn = async (req, res, next) => {
  // Destructure email and password from request body
  const { email, password, mobileNumber } = req.body;

  // Find user by email or mobileNumber
  const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  // If user not found, throw error
  if (!user)
    return next(
      new ErrorHandleClass(
        "User not found",
        404,
        "user not found with provided email or mobile number"
      )
    );

  // Check if password is correct
  const isMatched = compareSync(password, user.password);
  // If password is incorrect, throw error
  if (!isMatched)
    return next(
      new ErrorHandleClass(
        "Invalid login credentials",
        404,
        "invalid login credentials"
      )
    );

  // Generate token
  const token = jwt.sign({ userId: user._id }, "loggedInToken", {
    expiresIn: "1h",
  });
  // update status
  const updateStatus = await User.findById(user._id, { status:"online"})

  // Return JSON response with token if successful
  res.status(200).json({ massage: "user logged in ", token });
};
// *************************************************************
// update data
const updateData = async (req, res) => {
  // destruct data to update it
  const { firstName, lastName, email, recoveryEmail, mobileNumber } = req.body;
  const { _id } = req.authUser;
  // update user
  const userObject = {
    firstName,
    lastName,
    userName: firstName + lastName,
    recoveryEmail,
    email,
    mobileNumber,
  };
  // update user and return the new userObject
  const updatedUser = await User.findByIdAndUpdate(_id, userObject, {
    new: true,
  });
  //  if data does not updated
  if (!updatedUser)
    return next(
      new ErrorHandleClass("Data not updated", 404, "data not updated")
    );

  res.status(200).json({ massage: "user updated", updatedUser });
};
// **********************************************************************
//  delete account
const deleteAccount = async (req, res, next) => {
  //only the owner of the account can delete his account data
  const user = await User.findByIdAndDelete(req.authUser._id);
  // if user is not exist
  if (!user)
    return next(new ErrorHandleClass("User not found", 404, "user not found"));
  // delete all added companies
  await Company.deleteMany({ companyHR: req.authUser._id });
  // delete all  added jobs by this user
  await Job.deleteMany({ addedBy: req.authUser._id });
  // delete all added application by this user
  await Job.deleteMany({ userId: req.authUser._id });
  res.status(200).json({ massage: "user deleted" });
};
// ******************************************************
//  Get profile data for another user
const getProfile = async (req, res, next) => {
  const { _id } = req.params;
  const user = await User.findById(_id).select("-password");
  res.status(200).json({ massage: "user profile", user });
};
// **********************************************************
//  Get user account data
const getAccountData = async (req, res, next) => {
  const { _id } = req.authUser;
  const user = await User.findById(_id);
  res.status(200).json({ massage: "user profile", user });
};
// **************************************************************************
//  update password
const updatePassword = async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  const { _id } = req.authUser;
  const user = await User.findById(_id);
  // match old password
  const isMatched = compareSync(oldPassword, user.password);
  if (!isMatched)
    return next(
      new ErrorHandleClass("Invalid old password", 404, "invalid old password")
    );
  // hash new password
  const hashPassword = hashSync(newPassword, 12);
  // update password
  user.password = hashPassword;
  await user.save();
  res.status(200).json({ massage: "password updated successfully" });
};
// ***************************************************************************
// Forget password (make sure of your data security specially the OTP and the newPassword )
const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ErrorHandleClass(
        "User not found",
        404,
        "user not found with provided email"
      )
    );
  // generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  // update user with OTP
  user.otp = otp;
  const otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
  // Update user with hashed OTP and expiration
  user.otp = await hashOTP(otp); // Hash OTP for security
  user.otpExpiration = otpExpiration;
  await user.save();
  // send OTP via email or SMS
  const sendEmail = await sendEmailService({
    to: email,
    subject: "Reset Password OTP",
    htmlMessage: `<p>Your OTP is ${otp}. Please use it to reset your password.</p>`,
  });
  //  check if email send
  if (!sendEmail)
    return next(
      new ErrorHandleClass("Failed to send OTP", 400, "failed to send OTP")
    );
  await user.save();
  res.status(200).json({ massage: "otp sended successfully", sendEmail });
};
const resetPassword = async (req, res, next) => {
  // destruct data from body
  const { email, newPassword, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ErrorHandleClass(
        "User not found",
        404,
        "user not found with provided email"
      )
    );
  // match OTP
  if (user.otp !== otp)
    return next(new ErrorHandleClass("Invalid OTP", 404, "invalid OTP"));
  //  check if otp expired
  if (user.otpExpiration < Date.now())
    return next(new ErrorHandleClass("OTP expired", 404, "OTP expired"));
  // remove OTP and expiration
  user.otp = null;
  user.otpExpiration = null;
  // hash new password
  const hashPassword = hashSync(newPassword, 12);
  // update password
  user.password = hashPassword;
  await user.save();
  res.status(200).json({ massage: "password reset successfully" });
};
// ****************************************************8
/**
 * Get all accounts associated to a specific recovery Email
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with the accounts data.
 */
const getAllAccounts = async (req, res, next) => {
  // Destructure the recoveryEmail from the request body
  const { _id: CompanyHR } = req.authUser;
  // destruct recovery email from req.authUser
  const { recoveryEmail } = req.authUser;
  // Find all users with the provided recoveryEmail
  const users = await User.find({ recoveryEmail });

  // Return the accounts data as a success response
  res.status(200).json({
    massage: "accounts associated with this email",
    users,
  });
};

export {
  signUp,
  signIn,
  updateData,
  deleteAccount,
  getProfile,
  getAccountData,
  updatePassword,
  forgetPassword,
  resetPassword,
  getAllAccounts,
};
