const bcrypt = require("bcrypt");
const { customOtpGen } = require("otp-gen-agent");

const User = require("../models/user.model");
const VerificationRequest = require("../models/verification-request.model");

const { generateToken } = require("../utils/generate-token");

// generate otp
module.exports.generatePhoneOtp = async (req, res, next) => {
  try {
    const otp = await generateOtp();
    console.log({ otp });

    const otpHash = await bcrypt.hash(otp, 10);
    await VerificationRequest.create({
      method: "phone",
      value: req.body.phone,
      otpHash,
    });
    res.status(200).json({
      status: "success",
      message: "otp sent",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.registerUser = async (req, res, next) => {
  const { email, name, phone, password } = req.body;
  try {
    let userExists = await User.exists({ email });
    userExists = userExists || (await User.exists({ phone }));
    if (userExists)
      return res.status(400).json({ status: "error", message: "user exists" });

    const otp = await generateOtp();
    console.log({ otp });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, name, phone, hash: passwordHash });

    const otpHash = await bcrypt.hash(otp, 10);
    await VerificationRequest.create({
      method: "email",
      value: req.body.email,
      otpHash,
    });

    res.status(200).json({
      status: "success",
      message: "otp sent",
    });
  } catch (err) {
    next(err);
  }
};

// verify otp
module.exports.verifyPhone = async (req, res, next) => {
  const { phone, otp } = req.body;

  try {
    const verificationRequest = await VerificationRequest.findOne({
      method: "phone",
      value: phone,
    }).sort({ createdAt: -1 });

    if (!verificationRequest)
      return res.status(400).json({
        status: "error",
        message: "invalid request",
      });

    const isMatch = await bcrypt.compare(otp, verificationRequest.otpHash);
    if (!isMatch)
      return res.status(400).json({
        status: "error",
        message: "incorrect otp",
      });

    if (verificationRequest.isUsed)
      return res.status(400).json({
        status: "error",
        message: "otp already used",
      });

    const isOtpExpired =
      Date.now().valueOf() - verificationRequest.createdAt.valueOf() > 6_00_000; // 10 minutes

    if (isOtpExpired)
      return res.status(400).json({
        status: "error",
        message: "otp expired",
      });

    let user = await User.findOne({ phone });
    console.log({ user });
    if (!user) user = await User.create({ phone });
    user.isVerified = true;
    await user.save();

    verificationRequest.isUsed = true;
    await verificationRequest.save();

    const accessToken = generateToken(user);
    return res.status(200).json({
      status: "success",
      message: "otp verified",
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const verificationRequest = await VerificationRequest.findOne({
      value: email,
    }).sort({ createdAt: -1 });
    if (!verificationRequest)
      return res.status(400).json({
        status: "error",
        message: "invalid request",
      });

    const isMatch = await bcrypt.compare(otp, verificationRequest.otpHash);
    if (!isMatch)
      return res.status(400).json({
        status: "error",
        message: "incorrect otp",
      });

    if (verificationRequest.isUsed)
      return res.status(400).json({
        status: "error",
        message: "otp already used",
      });

    const isOtpExpired =
      Date.now().valueOf() - verificationRequest.createdAt.valueOf() > 6_00_000; // 10 minutes

    if (isOtpExpired)
      return res.status(400).json({
        status: "error",
        message: "otp expired",
      });
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    ).select("-hash -createdAt -updatedAt -__v");
    console.log({ user });
    // user.isVerified = true;
    // await user.save();

    verificationRequest.isUsed = true;
    await verificationRequest.save();

    const accessToken = generateToken(user);
    return res.status(200).json({
      status: "success",
      message: "otp verified",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "incorrect email" });

    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "error", message: "incorrect password" });

    if (!user.isVerified) {
      // TODO: send otp
      const otp = await generateOtp();
      console.log({ otp });
      const verificationRequest = await VerificationRequest.create({
        method: "email",
        value: email,
        otpHash: await bcrypt.hash(otp, 10),
      });
      return res
        .status(200)
        .json({ status: "success", message: "verification otp send" });
    }

    const accessToken = generateToken(user);
    return res.status(200).json({
      status: "success",
      message: "login successful",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

function generateOtp() {
  return customOtpGen({ length: 6, chars: "0123456789" });
}
