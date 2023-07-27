const { validationResult } = require("express-validator");
const { pdfUpload } = require("../middlewares/pdf-upload.middleware");
const { imageUpload } = require("../middlewares/image-upload.middleware");

function validateReq(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  ``;
  result.errors.forEach((err) => {
    errors[err.path] = err.msg;
  });
  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
  });
}

validateReq.withPdf = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  if (req?.file?.filename) pdfUpload._delete(req?.file?.filename);
  const errors = {};
  ``;
  result.errors.forEach((err) => {
    errors[err.path] = err.msg;
  });
  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
  });
};
validateReq.withImage = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  if (req?.file?.filename) imageUpload._delete(req?.file?.filename);
  const errors = {};
  ``;
  result.errors.forEach((err) => {
    errors[err.path] = err.msg;
  });
  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
  });
};

module.exports = validateReq;
