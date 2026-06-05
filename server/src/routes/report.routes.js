const express = require("express");

const router = express.Router();

const controller = require("../controllers/report.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");

// ============ VIEW STATISTICS ============

router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.statistics
);

// ============ EXPORT TO EXCEL ============

/**
 * Xuất danh sách ứng viên Excel
 * GET /api/reports/export/applications/excel?status=APPROVED&universityId=1
 */
router.get(
  "/export/applications/excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportApplicationsExcel
);

/**
 * Xuất thống kê trạng thái Excel
 * GET /api/reports/export/status-statistics/excel
 */
router.get(
  "/export/status-statistics/excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportStatusStatisticsExcel
);

/**
 * Xuất thống kê theo ngành Excel
 * GET /api/reports/export/major-statistics/excel
 */
router.get(
  "/export/major-statistics/excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportMajorStatisticsExcel
);

/**
 * Xuất thống kê theo đợt tuyển Excel
 * GET /api/reports/export/admission-round-statistics/excel
 */
router.get(
  "/export/admission-round-statistics/excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportAdmissionRoundStatisticsExcel
);

/**
 * Xuất thống kê theo trường Excel
 * GET /api/reports/export/university-statistics/excel
 */
router.get(
  "/export/university-statistics/excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportUniversityStatisticsExcel
);

// ============ EXPORT TO CSV ============

/**
 * Xuất danh sách ứng viên CSV
 * GET /api/reports/export/applications/csv?status=APPROVED
 */
router.get(
  "/export/applications/csv",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportApplicationsCSV
);

/**
 * Xuất thống kê dạng CSV
 * GET /api/reports/export/statistics/csv?type=status|major|university|admissionRound
 */
router.get(
  "/export/statistics/csv",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportStatisticsCSV
);

// ============ LEGACY ROUTES ============

router.get(
  "/export-excel",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.exportExcel
);

module.exports = router;