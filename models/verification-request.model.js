const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["phone", "email"],
      required: true,
    },
    value: {
      type: String, // phone or email
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    otpHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VerificationRequest = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);
module.exports = VerificationRequest;
