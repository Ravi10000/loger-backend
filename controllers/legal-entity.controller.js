const LegalEntity = require("../models/legal-entity.model");
const { deleteFile } = require("../utils/delete-file");

module.exports.addLegalEntity = async (req, res, next) => {
  try {
    const {
      entityType,
      bankName,
      bankAccountNumber,
      accountHolderName,
      address,
      swiftCode,
      ICENumber,
    } = req.body;

    const entityExists = await LegalEntity.exists({ user: req.user._id });
    if (entityExists)
      return res
        .status(400)
        .json({ status: "error", message: "entity exists for this user" });
    const entity = await LegalEntity.create({
      user: req.user._id,
      entityType,
      bankName,
      bankAccountNumber,
      accountHolderName,
      address,
      swiftCode,
      ...(entityType === "company" && { ICENumber }),
    });
    res.status(200).json({
      status: "success",
      message: "entity added",
      entity,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateLegalEntity = async (req, res, next) => {
  try {
    const {
      entityType,
      bankName,
      bankAccountNumber,
      accountHolderName,
      address,
      swiftCode,
      ICENumber,
    } = req.body;
    const entity = await LegalEntity.findOneAndUpdate(
      { user: req.user._id },
      {
        ...(entityType && { entityType }),
        ...(bankName && { bankName }),
        ...(bankAccountNumber && { bankAccountNumber }),
        ...(accountHolderName && { accountHolderName }),
        ...(address && { address }),
        ...(swiftCode && { swiftCode }),
        ...(ICENumber && { ICENumber }),
      },
      { new: true }
    );

    if (!entity)
      return res
        .status(400)
        .json({ status: "error", message: "entity not found" });
    res.status(200).json({
      status: "success",
      message: "entity updated",
      entity,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchLegalEntity = async (req, res, next) => {
  try {
    const entity = await LegalEntity.findOne({ user: req.user._id }).select(
      "-__v -createdAt -updatedAt -user"
    );
    if (!entity)
      return res
        .status(400)
        .json({ status: "error", message: "entity not found" });
    res.status(200).json({
      status: "success",
      message: "entity sent",
      entity,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addSupportingDocument = async (req, res, next) => {
  try {
    const { name } = req?.body;
    const url = req?.file?.filename;
    if (!url)
      return res.status(400).json({
        status: "error",
        message: "validation failed",
        errors: {
          document: "document required",
        },
      });
    const entity = await LegalEntity.findOne({ user: req?.user?._id });
    if (!entity) {
      deleteFile(url);
      return res
        .status(400)
        .json({ status: "error", message: "entity not found" });
    }
    entity.supportingDocuments.push({ name, url });
    await entity.save();
    res.status(200).json({
      status: "success",
      message: "document added",
      entity,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateSupportingDocument = async (req, res, next) => {
  try {
    const { name, documentId } = req?.body;
    const url = req?.file?.filename;

    const entity = await LegalEntity.findOne({ user: req?.user?._id });
    if (!entity) {
      deleteFile(url);
      return res
        .status(400)
        .json({ status: "error", message: "entity not found" });
    }
    if (name) entity.supportingDocuments.id(documentId).name = name;
    if (url) entity.supportingDocuments.id(documentId).url = url;

    await entity.save();
    return res.status(200).json({
      status: "success",
      message: "document updated",
      entity,
    });
  } catch (err) {
    next(err);
  }
};
