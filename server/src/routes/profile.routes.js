const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validations/profile.validation");

router.get(
  "/me",
  authMiddleware,
  profileController.getProfile
);

router.put(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  profileController.updateProfile
);

module.exports = router;
