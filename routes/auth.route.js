const express = require("express");
const {
  generatePhoneOtp,
  registerUser,
  verifyPhone,
  verifyUser,
  loginUser,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validateReq = require("../middlewares/validate-req");

const router = express.Router();

// generate otp
router.post(
  "/phone",
  [body("phone").isMobilePhone().withMessage("invalid phone number")],
  validateReq,
  generatePhoneOtp
);
router.post(
  "/",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email is required"),

    body("phone")
      .isMobilePhone()
      .withMessage("invalid phone number")
      .notEmpty()
      .withMessage("phone is required"),

    body("name").notEmpty().withMessage("name is required"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        maxLength: 32,
      })
      .withMessage(
        "weak password, password should be 8-32 characters long with at least 1 uppercase, 1 lowercase, 1 number and 1 symbol"
      )
      .notEmpty()
      .withMessage("password is required"),
  ],
  validateReq,
  registerUser
);

// verify otp
router.put(
  "/phone",
  [
    body("phone").isMobilePhone().withMessage("invalid phone number"),
    body("otp")
      .isLength({ max: 6, min: 6 })
      .withMessage("otp length should be 6 digits")
      .isNumeric()
      .withMessage("invalid otp"),
  ],
  validateReq,
  verifyPhone
);
router.put(
  "/",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email is required"),
    body("otp")
      .isLength({ max: 6, min: 6 })
      .withMessage("otp length should be 6 digits")
      .isNumeric()
      .withMessage("invalid otp"),
  ],
  validateReq,
  verifyUser
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email")
      .notEmpty()
      .withMessage("email required"),
    body("password").notEmpty().withMessage("password required"),
  ],
  validateReq,
  loginUser
);

module.exports = router;
