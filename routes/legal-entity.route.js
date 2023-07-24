const express = require("express");
const { body, param } = require("express-validator");

const validateReq = require("../middlewares/validate-req");
const {
  addLegalEntity,
  updateLegalEntity,
  fetchLegalEntity,
  addSupportingDocument,
  updateSupportingDocument,
  deleteSupportingDocument,
} = require("../controllers/legal-entity.controller");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const { pdfUpload } = require("../middlewares/pdf-upload.middleware");
const { handleUploadError } = require("../middlewares/upload-error-handler");

const router = express.Router();

router.post(
  "/",
  isUser,
  [
    body("entityType")
      .toLowerCase()
      .custom((value) => {
        if (["company", "individual"].includes(value)) return true;
        throw new Error("entity type can be either company or individual");
      })
      .notEmpty()
      .withMessage("entity type required"),

    body("bankName").notEmpty().withMessage("bank name required"),
    body("bankAccountNumber")
      .isNumeric()
      .withMessage("invalid bank account number")
      .notEmpty()
      .withMessage("bank account number required"),
    body("accountHolderName")
      .notEmpty()
      .withMessage("account holder name required"),
    body("address").notEmpty().withMessage("address required"),
    body("swiftCode").notEmpty().withMessage("swift code required"),
    body("ICENumber").custom((value, { req }) => {
      if (req?.body?.entityType === "company")
        if (!value) throw new Error("ICE number required");
      return true;
    }),
  ],
  validateReq,
  addLegalEntity
);
router.put(
  "/",
  isUser,
  [
    body("entityType")
      .optional()
      .toLowerCase()
      .custom((value) => {
        if (["company", "individual"].includes(value)) return true;
        throw new Error("entity type can be either company or individual");
      }),
    body("bankName").optional(),
    body("bankAccountNumber")
      .optional()
      .isNumeric()
      .withMessage("invalid bank account number"),
    body("accountHolderName").optional(),
    body("address").optional(),
    body("swiftCode").optional(),
    body("ICENumber").optional(),
  ],
  isUser,
  isAdmin,
  validateReq,
  updateLegalEntity
);

router.post(
  "/documents",
  isUser,
  pdfUpload.single("document"),
  handleUploadError,
  [body("name").notEmpty().withMessage("document name required")],
  validateReq,
  addSupportingDocument
);
router.put(
  "/documents",
  isUser,
  pdfUpload.single("document"),
  handleUploadError,
  updateSupportingDocument
);

router.delete(
  "/documents/:documentId",
  isUser,
  [
    param("documentId")
      .isMongoId()
      .withMessage("invalid document Id")
      .notEmpty()
      .withMessage("document Id required"),
  ],
  deleteSupportingDocument
);
router.get("/", isUser, fetchLegalEntity);

module.exports = router;
