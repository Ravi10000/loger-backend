const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    maxGuests: Number,
    bathroomsCount: Number,
    childrenAllowed: Boolean,
    cribOffered: Boolean,
    apartmentSize: String,
    aboutProperty: String,
    aboutHost: String,
    aboutNeighborhood: String,
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
