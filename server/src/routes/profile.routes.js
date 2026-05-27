const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validations/profile.validation");

// GET /profiles/me - Lấy thông tin cá nhân từ Database
router.get(
  "/me",
  authMiddleware,
  profileController.getProfile
);

// PUT /profiles/me - Cập nhật thông tin cá nhân
router.put(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  profileController.updateProfile
);

module.exports = router;
