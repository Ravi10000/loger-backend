const { deleteImage, deletePdf } = require("../utils/delete-file");

module.exports.handleImageUploadError = (req, res, next) => {
  if (!req?.multerError) return next();
  if (req?.file?.filename) {
    deleteImage(req?.file?.filename);
  }
  if (req?.files?.length)
    req.files.forEach((file) => {
      deleteImage(file?.filename);
    });
  return res.status(400).json({
    status: "error",
    message: req.multerError,
  });
};
module.exports.handlePdfUploadError = (req, res, next) => {
  if (!req?.multerError) return next();
  if (req?.file?.filename) {
    deletePdf(req?.file?.filename);
  }
  if (req?.files?.length)
    req.files.forEach((file) => {
      deletePdf(file?.filename);
    });
  return res.status(400).json({
    status: "error",
    message: req.multerError,
  });
};
