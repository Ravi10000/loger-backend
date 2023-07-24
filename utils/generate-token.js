const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) =>
  jwt.sign(
    { _id: user._id, usertype: user.usertype },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
