const express = require("express");
const { body, param, query } = require("express-validator");
const validateReq = require("../middlewares/validate-req");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const {
  addProperty,
  updateProperty,
  fetchPropertyById,
  fetchMyProperties,
} = require("../controllers/property.controller");
const {
  validatePropertyType,
  validateGeoLocation,
} = require("../utils/custom-validators");

const router = express.Router();

router.post(
  "/",
  isUser,
  [
    body("propertyType")
      .custom(validatePropertyType)
      .notEmpty()
      .withMessage("property type required"),
    body("propertyName").notEmpty().withMessage("property name required"),
  ],
  validateReq,
  addProperty
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
    body("propertyType").optional().custom(validatePropertyType),
    body("pincode").optional().isNumeric().withMessage("invalid pincode"),
    body("geoLocation").optional().custom(validateGeoLocation),
    body("breakfastServed")
      .optional()
      .isBoolean()
      .withMessage("breakfast served can be true or false only"),
    body("breakfastIncluded")
      .optional()
      .isBoolean()
      .withMessage("breakfast included can be true or false only"),
    body("breakfastPrice").optional().isNumeric().withMessage("invalid price"),
    body("typesOfBreakfast")
      .optional()
      .isArray()
      .withMessage("types of breakfast should be an array"),
    body("languagesSpoken")
      .optional()
      .isArray()
      .withMessage("languages be an array"),
    body("parkingAvailable")
      .optional()
      .isBoolean()
      .withMessage("parking available can be true or false only"),
    body("parkingReservation")
      .optional()
      .isBoolean()
      .withMessage("parking reservation can be true or false only"),
    body("parkingLocation")
      .optional()
      .isIn(["onsite", "offsite"])
      .withMessage("parking location can be onsite or offsite only"),
    body("parkingType")
      .optional()
      .isIn(["private", "public"])
      .withMessage("parking type can be private or public only"),
    body("houseRules")
      .optional()
      .isArray()
      .withMessage("house rules has to be an array"),
    body("facilities")
      .optional()
      .isArray()
      .withMessage("facilities has to be an array"),
  ],
  validateReq,
  updateProperty
);

router.get("/my-properties", isUser, fetchMyProperties);
router.get("/:id", fetchPropertyById);
module.exports = router;
