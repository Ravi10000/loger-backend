module.exports.errorHandler = (err, _, res, next) => {
  console.log({ errorMessage: err?.message, errorCause: err?.cause });
  if (!err) return;
  return res.status(err?.cause?.status || 500).json({
    status: "error",
    message: err?.message || "😐 something went wrong",
  });
};
