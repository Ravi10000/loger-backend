const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/delete-file");

module.exports = function validateReq(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  if (req?.file?.filename) deleteFile(req?.file?.filename);
  const errors = {};
  result.errors.forEach((err) => {
    errors[err.path] = err.msg;
  });
  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
  });
};
