const LegalEntity = require("../models/legal-entity.model");
const Property = require("../models/property.model");

module.exports.addProperty = async (req, res, next) => {
  try {
    const { propertyType, propertyName } = req.body;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    const property = await Property.create({
      propertyName,
      propertyType,
      entity: entity._id,
    });
    if (!property) throw new Error("error adding property");
    res.status(201).json({
      success: "success",
      message: "property added",
      property,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateProperty = async (req, res, next) => {
  try {
    const {
      propertyId,
      propertyType,
      propertyName,
      country,
      city,
      address,
      pincode,
      geoLocation,
      breakfastServed,
      breakfastIncluded,
      breakfastPrice,
      typesOfBreakfast,
      languagesSpoken,
      parkingAvailable,
      parkingReservation,
      parkingLocation,
      parkingType,
      houseRules,
      checkInStartTime,
      checkInEndTime,
      checkOutStartTime,
      checkOutEndTime,
      facilities,
    } = req.body;
    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        ...(propertyType && { propertyType }),
        ...(propertyName && { propertyName }),
        ...(country && { country }),
        ...(city && { city }),
        ...(address && { address }),
        ...(pincode && { pincode }),
        ...(typeof geoLocation !== "undefined" && { geoLocation }),
        ...(typeof breakfastServed !== "undefined" && { breakfastServed }),
        ...(typeof breakfastIncluded !== "undefined" && { breakfastIncluded }),
        ...(breakfastPrice && { breakfastPrice }),
        ...(typesOfBreakfast && { typesOfBreakfast }),
        ...(languagesSpoken && { languagesSpoken }),
        ...(typeof parkingAvailable !== "undefined" && { parkingAvailable }),
        ...(typeof parkingReservation !== "undefined" && {
          parkingReservation,
        }),
        ...(parkingLocation && { parkingLocation }),
        ...(parkingType && { parkingType }),
        ...(houseRules && { houseRules }),
        ...(checkInStartTime && { checkInStartTime }),
        ...(checkInEndTime && { checkInEndTime }),
        ...(checkOutStartTime && { checkOutStartTime }),
        ...(checkOutEndTime && { checkOutEndTime }),
        ...(facilities && { facilities }),
      },
      { new: true }
    );
    if (!property) throw new Error("error while updating property");
    res.status(201).json({
      success: "success",
      message: "property updated",
      property,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchPropertyById = async (req, res, next) => {
  try {
    const property = (await Property.findById(req.params.id)).populated(
      "apartment hotel houseRules facilities"
    );
    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    res.status(200).json({
      success: "success",
      message: "property fetched",
      property,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchMyProperties = async (req, res, next) => {
  try {
    const { type } = req.query;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("entity not found", { cause: { status: 404 } });
    const properties = await Property.find({
      entity: entity._id,
      ...(type && { propertyType: type }),
    });
    if (!properties) throw new Error("error fetching properties");
    res.status(200).json({
      success: "success",
      message: "properties fetched",
      properties,
    });
  } catch (err) {
    next(err);
  }
};
