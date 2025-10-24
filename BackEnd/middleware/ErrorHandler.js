export const errorHandler = (err, req, res) => {
  console.error("Error en el servidor:", err);
  const isClientError = err.statusCode && err.statusCode < 500;

  res.status(isClientError ? err.statusCode : 500).json({
    statusCode: isClientError ? err.statusCode : 500,
    body: {
      error: isClientError ? err.message : "Internal server error",
    },
  });
};
