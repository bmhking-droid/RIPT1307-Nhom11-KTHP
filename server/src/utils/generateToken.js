const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwt");

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
    algorithm: jwtConfig.algorithm,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
    algorithm: jwtConfig.algorithm,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
