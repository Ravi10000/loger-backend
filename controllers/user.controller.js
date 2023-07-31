const User = require("../models/user.model");

module.exports.addUserDetails = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("user not found", { cause: { status: 404 } });
    user.name = name;
    user.email = email;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "user details updated",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-hash -createdAt -updatedAt -__v"
    );
    if (!user) throw new Error("user not found", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "user details fetched",
      user,
    });
  } catch (err) {
    next(err);
  }
};
