// Not found middleware (404)
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
}

// Global error handler (500 and custom errors)
function errorHandler(err, req, res, next) {
  console.error("Server error:", err.stack || err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error"
  });
}

module.exports = { notFoundHandler, errorHandler };

