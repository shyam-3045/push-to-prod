module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  console.error("🔥 UNEXPECTED ERROR:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong"
  });
};
