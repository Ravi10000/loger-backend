const jwt = require("jsonwebtoken");

module.exports.isUser = (req, res, next) => {
  try {
    const InvalidAccessTokenError = new Error("invalid access token", {
      cause: { status: 403 },
    });
    if (!req?.headers?.authorization) throw InvalidAccessTokenError;

    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw InvalidAccessTokenError;

    console.log({ token });
    const decoded = jwt.decode(token);
    if (!decoded) throw InvalidAccessTokenError;

    console.log({ decoded });
    if (decoded?.exp < Date.now() / 1000)
      throw new Error("access token expired", { cause: { status: 403 } });

    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log({ user: req.user });
    if (!req.user) throw InvalidAccessTokenError;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isAdmin = (req, _, next) => {
  console.log({ user: req.user });
  try {
    if (req?.user?.usertype !== "admin")
      throw new Error("unauthorized", { cause: { status: 403 } });
    next();
  } catch (err) {
    next(err);
  }
};
module.exports.isSuperAdmin = (req, _, next) => {
  console.log({ user: req.user });
  try {
    if (req?.user?.usertype !== "superadmin")
      throw new Error("unauthorized", { cause: { status: 403 } });
    next();
  } catch (err) {
    next(err);
  }
};
module.exports.isStaff = (req, _, next) => {
  console.log({ user: req.user });
  try {
    if (req?.user?.usertype !== "staff")
      throw new Error("unauthorized", { cause: { status: 403 } });
    next();
  } catch (err) {
    next(err);
  }
};
