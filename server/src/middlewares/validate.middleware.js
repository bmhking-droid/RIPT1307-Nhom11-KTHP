const { errorResponse } = require("../utils/response");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.details.map((detail) => detail.message);
      return errorResponse(res, "Validation failed", 400, errors);
    }
  };
};

module.exports = { validate };
