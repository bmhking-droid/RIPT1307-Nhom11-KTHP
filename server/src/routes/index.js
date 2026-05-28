const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const profileRoutes = require("./profile.routes");
const uploadRoutes = require("./upload.routes");
const universityRoutes = require("./university.routes");
const majorRoutes = require("./major.routes");
const combinationRoutes = require("./admissionCombination.routes");
const roundRoutes = require("./admissionRound.routes");
const applicationRoutes = require("./application.routes");
const reportRoutes = require("./report.routes");
const settingRoutes = require("./setting.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/upload", uploadRoutes);
router.use("/universities", universityRoutes);
router.use("/majors", majorRoutes);
router.use("/admission-combinations", combinationRoutes);
router.use("/admission-rounds", roundRoutes);
router.use("/applications", applicationRoutes);
router.use("/reports", reportRoutes);
router.use("/settings", settingRoutes);

module.exports = router;
