const HouseRule = require("../models/house-rule.model");

module.exports.addHouseRule = async (req, res, next) => {
  try {
    const { rule, propertyType, status } = req.body;
    const houseRule = await HouseRule.create({
      rule,
      propertyType,
      status,
      createdBy: req.user._id,
    });
    if (!houseRule) throw new Error("error adding rule");
    res.status(201).json({
      success: "success",
      message: "rule added",
      houseRule,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateHouseRule = async (req, res, next) => {
  try {
    console.log(req.body);
    const { rule, propertyType, status, ruleId } = req.body;
    const houseRule = await HouseRule.findByIdAndUpdate(ruleId, {
      ...(rule && { rule }),
      ...(propertyType, { propertyType }),
      ...(status, { status }),
    });
    if (!houseRule)
      throw new Error("house rule not found", { cause: { status: 404 } });
    res.status(201).json({
      success: "success",
      message: "rule added",
      houseRule,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchHouseRules = async (req, res, next) => {
  try {
    const { status, propertyType } = req.query;
    const houseRules = await HouseRule.find({
      ...(propertyType && { propertyType }),
      ...(status && { status }),
    });
    if (!houseRules) throw new Error("error fetching rules");
    res.status(200).json({
      success: "success",
      houseRules,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchHouseRuleById = async (req, res, next) => {
  try {
    const houseRule = await HouseRule.findById(req.params.id);
    if (!houseRule)
      throw new Error("rule not found", { cause: { status: 404 } });
    res.status(200).json({
      success: "success",
      message: "rule fetched",
      houseRule,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.deleteHouseRule = async (req, res, next) => {
  try {
    const houseRule = await HouseRule.findByIdAndDelete(req.params.id);
    if (!houseRule)
      throw new Error("error deleting rule", { cause: { status: 404 } });
    res.status(200).json({
      success: "success",
      message: "rule deleted",
    });
  } catch (err) {
    next(err);
  }
};
