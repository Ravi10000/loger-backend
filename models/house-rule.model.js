const mongoose = require("mongoose");

const houseRuleSchema = new mongoose.Schema(
  {
    rule: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["hotel", "apartment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const HouseRule = mongoose.model("HouseRule", houseRuleSchema);
module.exports = HouseRule;
