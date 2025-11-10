export const errorHandler = (err, req, res, next) => {
  if (err.response) {
    return res
      .status(err.statusCode || 500)
      .json(err.response);
  }

  const statusCode = err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
  const message = err.statusCode && err.statusCode < 500
    ? err.message
    : "Internal server error";
  res.status(statusCode).json({
    statusCode,
    body: { error: message },
  });
};
