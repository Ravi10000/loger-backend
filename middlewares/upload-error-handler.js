const { deleteFile } = require("../utils/delete-file");

module.exports.handleUploadError = (req, res, next) => {
  if (!req?.multerError) return next();
  if (req?.file?.filename) {
    deleteFile(req?.file?.filename);
  }
  if (req?.files?.length)
    req.files.forEach((file) => {
      deleteFile(file?.filename);
    });
  return res.status(400).json({
    status: "error",
    message: req.multerError,
  });
};
