const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const profileRoutes = require("./profile.routes");
const uploadRoutes = require("./upload.routes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
