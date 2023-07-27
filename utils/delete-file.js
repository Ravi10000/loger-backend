const fs = require("fs");
const path = require("path");
// const imagesPath = path.join(path.dirname(__dirname), "uploads");
const { imagesPath } = require("../middlewares/image-upload.middleware");
const { pdfsPath } = require("../middlewares/pdf-upload.middleware");

module.exports.deleteImage = (filename) => {
  try {
    fs.unlinkSync(`${imagesPath}/${filename}`);
  } catch (err) {
    console.log(err.message);
  }
};
module.exports.deletePdf = (filename) => {
  try {
    fs.unlinkSync(`${pdfsPath}/${filename}`);
  } catch (err) {
    console.log(err.message);
  }
};
