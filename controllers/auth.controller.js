const bcrypt = require("bcrypt");
const { customOtpGen } = require("otp-gen-agent");

const User = require("../models/user.model");
const VerificationRequest = require("../models/verification-request.model");

const { generateToken } = require("../utils/generate-token");
const { verifyGoogleToken } = require("../utils/verify-google-token");
const jwt = require("jsonwebtoken");

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
module.exports.registerUserWithEmail = async (req, res, next) => {
  const { email, name, phone, password } = req.body;
  try {
    let userExists = await User.exists({ email });
    userExists = userExists || (await User.exists({ phone }));
    if (userExists) throw new Error("user exists", { cause: { status: 400 } });

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
module.exports.verifyUserPhone = async (req, res, next) => {
  const { phone, otp } = req.body;

  try {
    const verificationRequest = await VerificationRequest.findOne({
      method: "phone",
      value: phone,
    }).sort({ createdAt: -1 });

    if (!verificationRequest)
      throw new Error("invalid request", { cause: { status: 400 } });

    const isMatch = await bcrypt.compare(otp, verificationRequest.otpHash);
    if (!isMatch) throw new Error("incorrect otp", { cause: { status: 400 } });

    if (verificationRequest.isUsed)
      throw new Error("otp already used", { cause: { status: 400 } });

    const isOtpExpired =
      Date.now().valueOf() - verificationRequest.createdAt.valueOf() > 6_00_000; // 10 minutes

    if (isOtpExpired)
      throw new Error("otp expired", { cause: { status: 400 } });

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

module.exports.verifyUserEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const verificationRequest = await VerificationRequest.findOne({
      value: email,
    }).sort({ createdAt: -1 });
    if (!verificationRequest)
      throw new Error("invalid request", { cause: { status: 400 } });

    const isMatch = await bcrypt.compare(otp, verificationRequest.otpHash);
    if (!isMatch) throw new Error("incorrect otp", { cause: { status: 400 } });

    if (verificationRequest.isUsed)
      throw new Error("otp already used", { cause: { status: 400 } });

    const isOtpExpired =
      Date.now().valueOf() - verificationRequest.createdAt.valueOf() > 6_00_000; // 10 minutes

    if (isOtpExpired)
      throw new Error("otp expired", { cause: { status: 400 } });
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    ).select("-hash -createdAt -updatedAt -__v");
    console.log({ user });

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

module.exports.loginUserEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user) throw new Error("incorrect email", { cause: { status: 400 } });

    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch)
      throw new Error("incorrect password", { cause: { status: 400 } });

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

module.exports.gAuth = async (req, res, next) => {
  try {
    const verificationResponse = await verifyGoogleToken(req.body.credential);
    if (verificationResponse.error)
      throw new Error(verificationResponse.error, { cause: { status: 400 } });
    const profile = verificationResponse?.payload;
    console.log({ profile });
    let user = await User.findOne({ googleId: profile?.sub });
    // {
    //   profile: {
    //     iss: 'https://accounts.google.com',
    //     nbf: 1690786001,
    //     aud: '120794505569-c78e1eo3hac995ihjd9iu8h5rfklqkar.apps.googleusercontent.com',
    //     sub: '115965328904069995693',
    //     email: 'ruravi80@gmail.com',
    //     email_verified: true,
    //     azp: '120794505569-c78e1eo3hac995ihjd9iu8h5rfklqkar.apps.googleusercontent.com',
    //     name: 'Ravi Sharma',
    //     picture: 'https://lh3.googleusercontent.com/a/AAcHTtcnRGPNor6JGOuD5HUPAs3Ty7AnO8tnmhcwaWMlFy6wp2w=s96-c',    given_name: 'Ravi',
    //     family_name: 'Sharma',
    //     iat: 1690786301,
    //     exp: 1690789901,
    //     jti: 'df6060e6436951730150c8a5985bbbf10c9318c3'
    //   }
    // }

    if (!user) {
      user = await User.create({
        name: profile?.given_name + " " + profile?.family_name,
        googleId: profile?.sub,
        email: profile?.email,
        // picture: profile?.picture,
        isVerified: true,
      });
    }
    res.status(201).json({
      status: "success",
      message: "Signup was successful",
      user: {
        _id: user?._id,
        firstName: profile?.given_name,
        lastName: profile?.family_name,
        picture: profile?.picture,
        email: profile?.email,
        accessToken: generateToken(user),
      },
    });
  } catch (err) {
    next(err);
  }
};

const generateOtp = () => customOtpGen({ length: 6, chars: "0123456789" });
