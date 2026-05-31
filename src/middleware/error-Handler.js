export const errorHandler = (err, req, res, next) => {
//   let customError = {
//       status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//       message: err.message || 'Something went wrong',
//   }

  console.error("error in request:", err.message);
  return res.status(err.status || 500).json({
    status: false,
    message: err.message || "Internal Server Error",
  });
};
