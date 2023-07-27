const Apartment = require("../models/apartment.model");

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
    const apartment = await Apartment.create({
      property: propertyId,
      ...(maxGuests && { maxGuests }),
      ...(bathroomsCount && { bathroomsCount }),
      ...(childrenAllowed && { childrenAllowed }),
      ...(cribOffered && { cribOffered }),
      ...(apartmentSize && { apartmentSize }),
      ...(aboutProperty && { aboutProperty }),
      ...(aboutHost && { aboutHost }),
      ...(aboutNeighborhood && { aboutNeighborhood }),
    });
    if (!apartment) throw new Error("error adding apartment");
    res.status(201).json({
      success: "success",
      message: "apartment added",
      apartment,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateApartment = async (req, res, next) => {
  try {
    const {
      apartmentId,
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
    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      {
        ...(propertyId && { property: propertyId }),
        ...(maxGuests && { maxGuests }),
        ...(bathroomsCount && { bathroomsCount }),
        ...(childrenAllowed && { childrenAllowed }),
        ...(cribOffered && { cribOffered }),
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
