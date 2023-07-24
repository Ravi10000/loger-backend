module.exports.errorHandler = (err, _, res, next) => {
  console.log({ err });
  if (!err) return;
  return res.status(err?.status || 500).json({
    status: "error",
    message: err?.explicitMessage || "😐 something went wrong",
  });
};
