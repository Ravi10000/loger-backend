const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join(path.dirname(__dirname), "uploads");

function imageFilter(req, file, cb) {
  const filetype = file.mimetype;
  const fileExtension = path.extname(file.originalname);
  console.log({ filetype, fileExtension });
  const validFileExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  const validImageTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
  ];
  if (
    !validImageTypes.includes(filetype) ||
    !validFileExtensions.includes(fileExtension)
  ) {
    console.log("invalid image type");
    req.multerError =
      file.fieldname +
      " : " +
      "Only .png, .jpg, .jpeg and .webp format allowed!";
    cb(null, false);
  }
  cb(null, true);
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath + "/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageUpload = multer({ storage: imageStorage, fileFilter: imageFilter });

module.exports.imageUpload = imageUpload;
module.exports.uploadPath = uploadPath;
