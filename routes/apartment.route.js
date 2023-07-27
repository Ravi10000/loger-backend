const express = require("express");
const router = express.Router();
const validateReq = require("../middlewares/validate-req");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const {
  addApartment,
  updateApartment,
} = require("../controllers/apartment.controller");
const { body } = require("express-validator");

router.post(
  "/",
  isUser,
  [
    body("propertyId")
      .isMongoId()
      .withMessage("invalid property id")
      .notEmpty()
      .withMessage("property id required"),
    body("maxGuests")
      .optional()
      .isNumeric()
      .withMessage("max guests should be number"),
    body("bathroomsCount")
      .optional()
      .isNumeric()
      .withMessage("bathrooms count should be number"),
    body("childrenAllowed")
      .optional()
      .isBoolean()
      .withMessage("only accepts true or false"),
    body("cribOffered")
      .optional()
      .isBoolean()
      .withMessage("only accepts true or false"),
    body("aboutProperty")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about property should be less than 500 characters"),
    body("aboutHost")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about host should be less than 500 characters"),
    body("aboutNeighborhood")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about neighborhood should be less than 500 characters"),
  ],
  validateReq,
  addApartment
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
    body("maxGuests")
      .optional()
      .isNumeric()
      .withMessage("max guests should be number"),
    body("bathroomsCount")
      .optional()
      .isNumeric()
      .withMessage("bathrooms count should be number"),
    body("childrenAllowed")
      .optional()
      .isBoolean()
      .withMessage("only accepts true or false"),
    body("cribOffered")
      .optional()
      .isBoolean()
      .withMessage("only accepts true or false"),
    body("aboutProperty")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about property should be less than 500 characters"),
    body("aboutHost")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about host should be less than 500 characters"),
    body("aboutNeighborhood")
      .optional()
      .isLength({ max: 500 })
      .withMessage("about neighborhood should be less than 500 characters"),
  ],
  validateReq,
  updateApartment
);

module.exports = router;
