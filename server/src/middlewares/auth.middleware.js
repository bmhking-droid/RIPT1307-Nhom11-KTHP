const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../configs");
const { errorResponse } = require("../utils/response");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Access token is required", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Token has expired", 401);
    }
    return errorResponse(res, "Invalid token", 401);
  }
};

module.exports = authenticate;
module.exports.authenticate = authenticate;
