const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    hash: String,
    googleId: String,
    facebookId: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    usertype: {
      type: String,
      enum: ["superadmin", "staff", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
