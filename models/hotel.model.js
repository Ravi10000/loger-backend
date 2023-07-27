const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
    unique: true,
  },
  star: {
    type: Number,
    required: true,
  },
  chainName: String,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
