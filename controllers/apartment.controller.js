const Apartment = require("../models/apartment.model");
const LegalEntity = require("../models/legal-entity.model");
const Property = require("../models/property.model");

module.exports.addApartment = async (req, res, next) => {
  try {
    const {
      propertyId,
      maxGuests,
      bathroomsCount,
      childrenAllowed,
      cribOffered,
      apartmentSize,
      aboutProperty,
      aboutHost,
      aboutNeighborhood,
    } = req.body;
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
    const apartment = await Apartment.create({
      property: propertyId,
      ...(maxGuests && { maxGuests }),
      ...(bathroomsCount && { bathroomsCount }),
      ...(typeof childrenAllowed !== "undefined" && { childrenAllowed }),
      ...(typeof cribOffered !== "undefined" && { cribOffered }),
      ...(apartmentSize && { apartmentSize }),
      ...(aboutProperty && { aboutProperty }),
      ...(aboutHost && { aboutHost }),
      ...(aboutNeighborhood && { aboutNeighborhood }),
    });
    if (!apartment) throw new Error("error adding apartment");
    property.apartment = apartment._id;
    await property.save();
    res.status(201).json({
      success: "success",
      message: "apartment added",
      property,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateApartment = async (req, res, next) => {
  try {
    const {
      propertyId,
      maxGuests,
      bathroomsCount,
      childrenAllowed,
      cribOffered,
      apartmentSize,
      aboutProperty,
      aboutHost,
      aboutNeighborhood,
    } = req.body;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("legal entity not found", { cause: { status: 404 } });
    const property = await Property.findOne({
      _id: propertyId,
      entity: entity._id,
    });
    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    const apartment = await Apartment.findOneAndUpdate(
      { property: propertyId },
      {
        ...(maxGuests && { maxGuests }),
        ...(bathroomsCount && { bathroomsCount }),
        ...(typeof childrenAllowed !== "undefined" && { childrenAllowed }),
        ...(typeof cribOffered !== "undefined" && { cribOffered }),
        ...(apartmentSize && { apartmentSize }),
        ...(aboutProperty && { aboutProperty }),
        ...(aboutHost && { aboutHost }),
        ...(aboutNeighborhood && { aboutNeighborhood }),
      },
      { new: true }
    );
    if (!apartment) throw new Error("error adding apartment");
    res.status(200).json({
      success: "success",
      message: "apartment updated",
      apartment,
    });
  } catch (err) {
    next(err);
  }
};
