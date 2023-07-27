const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfsPath = path.join(path.dirname(__dirname), "uploads/pdfs");

function pdfFilter(req, file, cb) {
  const fileType = file.mimetype;
  const fileExtension = path.extname(file.originalname);
  if (fileType !== "application/pdf" || fileExtension !== ".pdf") {
    console.log({ fileType, fileExtension });
    console.log("invalid pdf file");
    req.multerError = file.fieldname + " : " + "Only .pdf format allowed";
    cb(null, false);
  }
  cb(null, true);
}

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfsPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFilter });
pdfUpload._delete = (filename) => {
  try {
    fs.unlinkSync(`${pdfsPath}/${filename}`);
  } catch (err) {
    console.log(err.message);
  }
};
pdfUpload._handleError = (req, res, next) => {
  if (!req?.multerError) return next();
  if (req?.file?.filename) {
    pdfUpload._delete(req?.file?.filename);
  }
  if (req?.files?.length)
    req.files.forEach((file) => {
      pdfUpload._delete(file?.filename);
    });
  return res.status(400).json({
    status: "error",
    message: req.multerError,
  });
};
module.exports.pdfsPath = pdfsPath;
module.exports.pdfUpload = pdfUpload;
