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

  return errorResponse(res, err.message || "Internal Server Error", 500);
};

module.exports = { errorHandler };
