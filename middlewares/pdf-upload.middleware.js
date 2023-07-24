const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join(path.dirname(__dirname), "uploads");

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
    cb(null, uploadPath + "/pdfs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFilter });

module.exports.pdfUpload = pdfUpload;
