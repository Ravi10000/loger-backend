const Property = require("../models/property.model");
const Hotel = require("../models/hotel.model");
const LegalEntity = require("../models/legal-entity.model");

module.exports.addHotelDetails = async (req, res, next) => {
  try {
    const { propertyId, star, chainName } = req.body;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("legal entity not found", { cause: { status: 404 } });
    const property = await Property.findOne({
      _id: propertyId,
      entity: entity._id,
    });
    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    if (property.hotel || property.apartment)
      throw new Error("apartment, hotel already exists", {
        cause: { status: 400 },
      });

    const hotel = await Hotel.create({
      property: property._id,
      star,
      ...(chainName && { chainName }),
    });
    if (!hotel) throw new Error("error adding hotel");

    property.hotel = hotel._id;
    await property.save();
    res.status(200).json({
      status: "success",
      message: "hotel added",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateHotelDetails = async (req, res, next) => {
  try {
    const { propertyId, star, chainName } = req.body;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("legal entity not found", { cause: { status: 404 } });
    const property = await Property.findOne({
      _id: propertyId,
      entity: entity._id,
    });
    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    const hotel = await Hotel.findOneAndUpdate(property?.hotel?._id, {
      ...(star && { star }),
      ...(chainName && { chainName }),
    });
    if (!hotel) throw new Error("error updating hotel");
    res.status(200).json({
      status: "success",
      message: "hotel updated",
    });
  } catch (err) {
    next(err);
  }
};
