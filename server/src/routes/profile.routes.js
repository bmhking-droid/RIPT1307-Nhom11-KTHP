const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.put("/me", authMiddleware, profileController.updateProfile);

module.exports = router;
