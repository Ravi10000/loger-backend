const express = require("express");
const { isUser } = require("../middlewares/auth.middleware");
const {
  addUserDetails,
  fetchUserDetails,
} = require("../controllers/user.controller");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  isUser,
  [
    body("email")
      .optional()
      .toLowerCase()
      .isEmail()
      .withMessage("invalid email address"),
  ],
  addUserDetails
);

router.get("/", isUser, fetchUserDetails);
module.exports = router;
