const jwt = require("jsonwebtoken");

module.exports.isUser = (req, res, next) => {
  if (!req?.headers?.authorization)
    return next({
      status: 403,
      explicitMessage: "access token required",
    });

  const token = req.headers.authorization.split(" ")[1];
  if (!token)
    return next({
      status: 403,
      explicitMessage: "invalid access token",
    });

  console.log({ token });
  const decoded = jwt.decode(token);
  if (!decoded) {
    return next({
      status: 403,
      explicitMessage: "invalid access token",
    });
  }
  console.log({ decoded });
  if (decoded?.exp < Date.now() / 1000) {
    return next({
      status: 403,
      explicitMessage: "access token expired",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!req.user) {
      return next({
        status: 403,
        explicitMessage: "invalid access token",
      });
    }
    next();
  } catch (err) {
    next({
      status: 403,
      explicitMessage: "invalid access token",
    });
  }
};

module.exports.isAdmin = (req, res, next) => {
  console.log({ user: req.user });
  if (req?.user?.usertype === "admin") next();
  else
    next({
      status: 403,
      explicitMessage: "unauthorized",
    });
};
