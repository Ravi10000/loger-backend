const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["apartment", "hotel", "villa"],
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

const Facility = mongoose.model("Facility", facilitySchema);

module.exports = Facility;
