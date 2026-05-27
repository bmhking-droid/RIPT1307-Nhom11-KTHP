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
    let message = "Dữ liệu đã tồn tại trên hệ thống!";
    const firstError = err.errors && err.errors[0];
    if (firstError) {
      const path = firstError.path;
      const modelName = firstError.instance
        ? (firstError.instance.constructor.name || 
           (firstError.instance._modelOptions && 
            firstError.instance._modelOptions.name && 
            firstError.instance._modelOptions.name.singular))
        : null;

      if (modelName === "University" && path === "code") {
        message = "Mã trường đã tồn tại trên hệ thống!";
      } else if (modelName === "Major" && path === "code") {
        message = "Mã ngành đã tồn tại trên hệ thống!";
      } else if (modelName === "User" && path === "email") {
        message = "Email này đã được sử dụng!";
      } else if (modelName === "Profile" && path === "cccd") {
        message = "Số CCCD này đã tồn tại trên hệ thống!";
      } else {
        // Fallback checks
        const table = err.parent && err.parent.table;
        if (path === "code") {
          if (table === "universities") {
            message = "Mã trường đã tồn tại trên hệ thống!";
          } else if (table === "majors") {
            message = "Mã ngành đã tồn tại trên hệ thống!";
          } else {
            message = "Mã này đã tồn tại trên hệ thống!";
          }
        } else if (path === "email") {
          message = "Email này đã được sử dụng!";
        } else if (path === "cccd") {
          message = "Số CCCD này đã tồn tại trên hệ thống!";
        }
      }
    }
    return errorResponse(res, message, 409);
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
