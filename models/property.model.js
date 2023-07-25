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
  accepted: {
    type: {
      type: Boolean,
      default: false,
    },
  },
});

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
  propertyName: String,
  country: String,
  city: String,
  address: String,
  pincode: String,
  geolocation: {
    type: Map,
    of: new Schema({
      latitude: String,
      longitude: String,
    }),
  },
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
