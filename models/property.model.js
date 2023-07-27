const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photoUrl: {
    type: String,
    required: true,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
});
const geoLocationSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const PropertySchema = new mongoose.Schema({
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LegalEntity",
    required: true,
  },
  propertyType: {
    type: String,
    enum: ["hotel", "villa", "apartment", "flat"],
    required: true,
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  propertyName: String,
  country: String,
  city: String,
  address: String,
  pincode: String,
  geoLocation: geoLocationSchema,
  breakfastServed: Boolean,
  breakfastIncluded: Boolean,
  breakfastPrice: Number,
  typesOfBreakfast: [String],
  languagesSpoken: [String],
  parkingAvailable: Boolean,
  parkingReservation: Boolean,
  parkingLocation: {
    type: String,
    enum: ["onsite", "offsite"],
  },
  parkingType: {
    type: String,
    enum: ["private", "public"],
  },
  houseRules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HouseRule",
    },
  ],
  checkInStartTime: String,
  checkInEndTime: String,
  checkOutStartTime: String,
  checkOutEndTime: String,
  facilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
  ],
  photos: [photoSchema],
});

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
