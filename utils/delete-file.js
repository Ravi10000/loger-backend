const fs = require("fs");
const path = require("path");
const uploadPath = path.join(path.dirname(__dirname), "uploads");

module.exports.deleteFile = (filename) => {
  try {
    fs.unlinkSync(`${uploadPath}/${filename}`);
  } catch (err) {
    console.log(err.message);
  }
};
