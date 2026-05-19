const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return errorResponse(
      res,
      "Validation Error",
      400,
      err.errors.map((e) => e.message),
    );
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return errorResponse(res, "Duplicate entry", 409);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.isJoi) {
    return errorResponse(res, err.details[0].message, 400);
  }

  if (err instanceof require("multer").MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File quá lớn. Giới hạn 5MB", 400);
    }
    return errorResponse(res, err.message, 400);
  }

  return errorResponse(res, err.message || "Internal Server Error", 500);
};

module.exports = { errorHandler };
