const LegalEntity = require("../models/legal-entity.model");
const Property = require("../models/property.model");
const { imageUpload } = require("../middlewares/image-upload.middleware");

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
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("entity not found", { cause: { status: 404 } });
    const property = await Property.findOneAndUpdate(
      { _id: propertyId, entity: entity._id },
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
    if (!property) throw new Error("unauthorised", { cause: { status: 403 } });
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
    console.log(req?.params?.id);
    const property = await Property.findById(req.params.id).populate(
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

module.exports.addPhoto = async (req, res, next) => {
  try {
    const { propertyId, isMain } = req.body;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("entity not found", { cause: { status: 404 } });
    const property = await Property.findOne({
      _id: propertyId,
      entity: entity._id,
    });
    if (!property) throw new Error("unauthorised", { cause: { status: 403 } });
    const photoUrl = req?.file?.filename;
    console.log({ photoUrl });
    if (!photoUrl)
      throw new Error("photo required", { cause: { status: 400 } });

    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    property.photos.push({ photoUrl, isMain });
    await property.save();
    res.status(201).json({
      success: "success",
      message: "photo added",
      property,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updatePhoto = async (req, res, next) => {
  try {
    const { propertyId, photoId, isMain } = req.body;
    const photoUrl = req?.file?.filename;
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("entity not found", { cause: { status: 404 } });

    const property = await Property.findOne({
      entity: entity._id,
      _id: propertyId,
    });
    if (!property) throw new Error("unauthorised", { cause: { status: 403 } });
    property.photos = property.photos.map((photo) => {
      if (!photo._id.equals(photoId)) return photo;
      if (photoUrl) imageUpload._delete(photo.photoUrl);

      return {
        ...photo,
        ...(photoUrl && { photoUrl }),
        ...(isMain && { isMain }),
      };
    });
    await property.save();
    res.status(201).json({
      success: "success",
      message: "photo updated",
      property,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.deletePhoto = async (req, res, next) => {
  try {
    const { propertyId, photoId } = req.params;
    console.log({ propertyId, photoId });
    const entity = await LegalEntity.findOne({ user: req.user._id });
    if (!entity)
      throw new Error("entity not found", { cause: { status: 404 } });
    const property = await Property.findById({
      _id: propertyId,
      entity: entity._id,
    });
    if (!property)
      throw new Error("property not found", { cause: { status: 404 } });
    property.photos = property.photos.filter((photo) => {
      const isPhoto = photo._id.equals(photoId);
      if (isPhoto) imageUpload._delete(photo.photoUrl);
      return !isPhoto;
    });
    await property.save();
    res.status(200).json({
      success: "success",
      message: "photo deleted",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyPhoto = async (req, res, next) => {
  try {
    const { propertyId, photoId } = req.params;
  } catch (err) {
    next(err);
  }
};
