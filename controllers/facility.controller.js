const Facility = require("../models/facility.model");

module.exports.addFacility = async (req, res, next) => {
  try {
    const { name, propertyType, status } = req.body;
    const facility = await Facility.create({
      name,
      propertyType,
      status,
      createdBy: req.user._id,
    });
    if (!facility) throw new Error("error adding facility");
    res.status(201).json({
      success: "success",
      message: "facility added",
      facility,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateFacility = async (req, res, next) => {
  try {
    const { name, propertyType, status, facilityId } = req.body;
    const facility = await Facility.findByIdAndUpdate(
      facilityId,
      {
        ...(name && { name }),
        ...(propertyType && { propertyType }),
        ...(status && { status }),
      },
      { new: true }
    );
    if (!facility) throw new Error("error adding facility");
    res.status(201).json({
      success: "success",
      message: "facility added",
      facility,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchFacilities = async (req, res, next) => {
  try {
    const { status, propertyType } = req.query;
    const facilities = await Facility.find({
      ...(propertyType && { propertyType }),
      ...(status && { status }),
    });
    if (!facilities) throw new Error("error fetching facilities");
    res.status(200).json({
      success: "success",
      message: "facilities fetched",
      facilities,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchFacilityById = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility)
      throw new Error("rule not found", { cause: { status: 404 } });
    res.status(200).json({
      success: "success",
      message: "facility fetched",
      facility,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility)
      throw new Error("facility not found", { cause: { status: 404 } });
    res.status(200).json({
      success: "success",
      message: "facility deleted",
    });
  } catch (err) {
    next(err);
  }
};
