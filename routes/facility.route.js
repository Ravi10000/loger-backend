const express = require("express");
const { body, query, param, check } = require("express-validator");
const validateReq = require("../middlewares/validate-req");
const { isSuperAdmin, isUser } = require("../middlewares/auth.middleware");
const {
  addFacility,
  updateFacility,
  fetchFacilities,
  fetchFacilityById,
  deleteFacility,
} = require("../controllers/facility.controller");
const {
  checkStatus,
  checkPropertyType,
} = require("../utils/custom-validators");

const router = express.Router();

router.post(
  "/",
  isUser,
  isSuperAdmin,
  [
    body("name").notEmpty().withMessage("facility name required"),
    body("status")
      .custom(checkStatus)
      .notEmpty()
      .withMessage("status required"),

    body("propertyType")
      .custom(checkPropertyType)
      .notEmpty()
      .withMessage("status required"),
  ],
  validateReq,
  addFacility
);

router.put(
  "/",
  isUser,
  isSuperAdmin,
  [
    body("facilityId")
      .isMongoId()
      .withMessage("invalid facility id")
      .notEmpty()
      .withMessage("facility id required"),
    body("status").optional().custom(checkStatus),
    body("propertyType").optional().custom(checkPropertyType),
  ],
  validateReq,
  updateFacility
);

router.get(
  "/:id",
  param("id")
    .isMongoId()
    .withMessage("invalid facility id")
    .notEmpty()
    .withMessage("facility id required"),
  validateReq,
  fetchFacilityById
);
router.get(
  "/",
  [
    query("status").optional().custom(checkStatus),
    query("propertyType").optional().custom(checkPropertyType),
  ],
  validateReq,
  fetchFacilities
);
router.delete(
  "/:id",
  param("id")
    .isMongoId()
    .withMessage("invalid facility id")
    .notEmpty()
    .withMessage("facility id required"),
  validateReq,
  deleteFacility
);

module.exports = router;
