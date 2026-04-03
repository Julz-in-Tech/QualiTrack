function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(500).json({
    message:
      error && error.message
        ? `Something went wrong on the server: ${error.message}`
        : "Something went wrong on the server.",
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
