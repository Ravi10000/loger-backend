const express = require("express");
const { body } = require("express-validator");
const {
  addHotelDetails,
  updateHotelDetails,
} = require("../controllers/hotel.controller");
const { isUser } = require("../middlewares/auth.middleware");
const validateReq = require("../middlewares/validate-req");
const router = express.Router();

router.post(
  "/",
  isUser,
  [
    body("propertyId")
      .isMongoId()
      .withMessage("invalid property id")
      .notEmpty()
      .withMessage("property id required"),
    body("star")
      .isNumeric()
      .withMessage("star must be a number")
      .notEmpty()
      .withMessage("star required"),
  ],
  validateReq,
  addHotelDetails
);
router.put(
  "/",
  isUser,
  [
    body("propertyId")
      .isMongoId()
      .withMessage("invalid property id")
      .notEmpty()
      .withMessage("property id required"),
    body("star")
      .optional()
      .isNumeric()
      .withMessage("star must be a number")
      .notEmpty()
      .withMessage("star required"),
  ],
  validateReq,
  updateHotelDetails
);

module.exports = router;
