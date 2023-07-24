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
    ICENumber: String,
    supportingDocuments: [documentSchema],
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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
