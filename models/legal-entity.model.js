const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const legalEntitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    entityType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["added", "verified"],
    },
    supportingDocuments: [documentSchema],
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ICENumber: String,
    bankName: String,
    bankAccountNumber: String,
    accountHolderName: String,
    address: String,
    swiftCode: String,
  },
  { timestamps: true }
);

const LegalEntity = mongoose.model("LegalEntity", legalEntitySchema);
module.exports = LegalEntity;
