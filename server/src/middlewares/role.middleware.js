const { errorResponse } = require("../utils/response");

const authorize = (...allowedRoles) => {
  const roles = [...allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    return errorResponse(
      res,
      "You do not have permission to access this resource",
      403,
    );
  };
};

module.exports = authorize;
