const express = require("express");
const { body, param, query } = require("express-validator");
const { isSuperAdmin, isUser } = require("../middlewares/auth.middleware");
const {
  addHouseRule,
  updateHouseRule,
  fetchHouseRules,
  fetchHouseRuleById,
  deleteHouseRule,
} = require("../controllers/house-rule.controller");
const validateReq = require("../middlewares/validate-req");

const router = express.Router();

router.post(
  "/",
  isUser,
  isSuperAdmin,
  [
    body("rule").notEmpty().withMessage("house rule required"),
    body("propertyType")
      .toLowerCase()
      .custom(checkPropertyType)
      .notEmpty()
      .withMessage("property type required"),
    body("status")
      .toLowerCase()
      .custom(checkStatus)
      .notEmpty()
      .withMessage("status required"),
  ],
  validateReq,
  addHouseRule
);
router.put(
  "/",
  isUser,
  isSuperAdmin,
  [
    body("ruleId")
      .isMongoId()
      .withMessage("invalid rule id")
      .notEmpty()
      .withMessage("rule id required"),
    body("rule").optional(),
    body("propertyType").optional().toLowerCase().custom(checkPropertyType),
    body("status").optional().toLowerCase().custom(checkStatus),
  ],
  validateReq,
  updateHouseRule
);
router.get(
  "/:id",
  isUser,
  param("id")
    .isMongoId()
    .withMessage("invalid rule id")
    .notEmpty()
    .withMessage("rule id required"),
  validateReq,
  fetchHouseRuleById
);
router.delete(
  "/:id",
  isUser,
  param("id")
    .isMongoId()
    .withMessage("invalid rule id")
    .notEmpty()
    .withMessage("rule id required"),
  validateReq,
  deleteHouseRule
);

router.get(
  "/",
  isUser,
  [
    query("status").optional().custom(checkStatus),
    query("propertyType").optional().custom(checkPropertyType),
  ],
  validateReq,
  fetchHouseRules
);

module.exports = router;

function checkPropertyType(value) {
  if (!["hotel", "apartment"].includes(value))
    throw new Error("property type can be either hotel or apartment");
  return true;
}
function checkStatus(value) {
  if (!["active", "inactive"].includes(value))
    throw new Error("status can be either active or inactive");
  return true;
}
