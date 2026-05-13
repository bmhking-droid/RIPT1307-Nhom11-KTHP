const { errorResponse } = require("../utils/response");
const { ROLES } = require("../utils/constants");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return errorResponse(
      res,
      "You do not have permission to access this resource",
      403,
    );
  };
};

module.exports = { authorize };
