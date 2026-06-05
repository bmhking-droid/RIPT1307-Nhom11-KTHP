const service = require("../services/report.service");

// ============ VIEW STATISTICS ============

exports.statistics = async (req, res, next) => {
  try {
    const data = await service.getStatistics();

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============ EXPORT TO EXCEL ============

/**
 * Xuất danh sách ứng viên dạng Excel
 */
exports.exportApplicationsExcel = async (req, res, next) => {
  try {
    const { status, universityId, majorId, admissionRoundId, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (universityId) filters.universityId = universityId;
    if (majorId) filters.majorId = majorId;
    if (admissionRoundId) filters.admissionRoundId = admissionRoundId;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const workbook = await service.exportApplicationsToExcel(filters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=danh-sach-ung-vien.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Xuất thống kê trạng thái hồ sơ dạng Excel
 */
exports.exportStatusStatisticsExcel = async (req, res, next) => {
  try {
    const workbook = await service.exportStatusStatisticsToExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=thong-ke-trang-thai.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Xuất thống kê theo ngành học dạng Excel
 */
exports.exportMajorStatisticsExcel = async (req, res, next) => {
  try {
    const { universityId } = req.query;
    const filters = {};
    if (universityId) filters.universityId = universityId;

    const workbook = await service.exportMajorStatisticsToExcel(filters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=thong-ke-nganh.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Xuất thống kê theo đợt tuyển sinh dạng Excel
 */
exports.exportAdmissionRoundStatisticsExcel = async (req, res, next) => {
  try {
    const workbook = await service.exportAdmissionRoundStatisticsToExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=thong-ke-dot-tuyen.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Xuất thống kê theo trường đại học dạng Excel
 */
exports.exportUniversityStatisticsExcel = async (req, res, next) => {
  try {
    const workbook = await service.exportUniversityStatisticsToExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=thong-ke-truong.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

// ============ EXPORT TO CSV ============

/**
 * Xuất danh sách ứng viên dạng CSV
 */
exports.exportApplicationsCSV = async (req, res, next) => {
  try {
    const { status, universityId, majorId, admissionRoundId, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (universityId) filters.universityId = universityId;
    if (majorId) filters.majorId = majorId;
    if (admissionRoundId) filters.admissionRoundId = admissionRoundId;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const csvData = await service.exportApplicationsToCSV(filters);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=danh-sach-ung-vien.csv");

    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * Xuất thống kê dạng CSV
 */
exports.exportStatisticsCSV = async (req, res, next) => {
  try {
    const { type = "status" } = req.query;

    const csvData = await service.exportStatisticsToCSV(type);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=thong-ke-${type}.csv`);

    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

// ============ LEGACY ============

exports.exportExcel = async (req, res, next) => {
  try {
    const workbook = await service.exportStatusStatisticsToExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};