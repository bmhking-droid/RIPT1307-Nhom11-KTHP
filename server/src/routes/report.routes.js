const express = require("express");

const router = express.Router();

const controller = require("../controllers/report.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");

router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.statistics,
);

router.get(
  "/export-excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportExcel,
);

module.exports = router;
