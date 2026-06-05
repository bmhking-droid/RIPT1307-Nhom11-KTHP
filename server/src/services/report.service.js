const { sequelize } = require("../models");
const repository = require("../repositories/report.repository");
const ExcelJS = require("exceljs");
const { stringify } = require("csv-stringify/sync");

// ============ STATISTICS FUNCTIONS ============

exports.getStatistics = async () => {
  const [applicationsByStatus] = await sequelize.query(`
    SELECT status, COUNT(*) as total
    FROM applications
    GROUP BY status
  `);

  const [applicationsByUniversity] = await sequelize.query(`
    SELECT u.name, COUNT(a.id) as total
    FROM applications a
    JOIN universities u
    ON a.universityId = u.id
    GROUP BY u.name
  `);

  return {
    applicationsByStatus,
    applicationsByUniversity,
  };
};

// ============ EXCEL EXPORT FUNCTIONS ============

/**
 * Xuất danh sách ứng viên đăng ký xét tuyển
 */
exports.exportApplicationsToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Danh sách ứng viên");

  // Tạo header
  worksheet.columns = [
    { header: "Mã hồ sơ", key: "applicationCode", width: 15 },
    { header: "Họ tên", key: "fullName", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "CCCD", key: "cccd", width: 15 },
    { header: "Số điện thoại", key: "phone", width: 15 },
    { header: "Trường đại học", key: "universityName", width: 25 },
    { header: "Ngành", key: "majorName", width: 20 },
    { header: "Đợt tuyển", key: "admissionRoundName", width: 20 },
    { header: "Điểm", key: "score", width: 10 },
    { header: "Trạng thái", key: "status", width: 15 },
    { header: "Ngày tạo", key: "createdAt", width: 15 },
  ];

  // Lấy dữ liệu
  const applications = await repository.getAllApplicationsDetailed(filters);

  // Thêm dữ liệu vào worksheet
  applications.forEach((app) => {
    worksheet.addRow({
      applicationCode: app.applicationCode,
      fullName: app.user?.profile?.fullName || "",
      email: app.user?.email || "",
      cccd: app.user?.profile?.cccd || "",
      phone: app.user?.profile?.phone || "",
      universityName: app.University?.name || "",
      majorName: app.Major?.name || "",
      admissionRoundName: app.AdmissionRound?.name || "",
      score: app.score,
      status: app.status,
      createdAt: app.createdAt ? app.createdAt.toLocaleDateString("vi-VN") : "",
    });
  });

  // Định dạng header
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF366092" },
  };
  worksheet.getRow(1).alignment = { horizontal: "center", vertical: "center" };

  return workbook;
};

/**
 * Xuất thống kê theo trạng thái hồ sơ
 */
exports.exportStatusStatisticsToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Thống kê trạng thái");

  worksheet.columns = [
    { header: "Trạng thái", key: "status", width: 20 },
    { header: "Số lượng", key: "total", width: 15 },
    { header: "Tỷ lệ (%)", key: "percentage", width: 15 },
  ];

  const statistics = await repository.countByStatus();

  statistics.forEach((item) => {
    worksheet.addRow({
      status: item.status,
      total: item.total,
      percentage: ((item.total / statistics.reduce((sum, s) => sum + s.total, 0)) * 100).toFixed(2),
    });
  });

  // Định dạng
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF366092" },
  };

  return workbook;
};

/**
 * Xuất thống kê theo ngành học
 */
exports.exportMajorStatisticsToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Thống kê theo ngành");

  worksheet.columns = [
    { header: "Ngành học", key: "majorName", width: 30 },
    { header: "Trường", key: "universityName", width: 25 },
    { header: "Số hồ sơ", key: "total", width: 15 },
  ];

  const [data] = await sequelize.query(`
    SELECT 
      m.name as majorName,
      u.name as universityName,
      COUNT(a.id) as total
    FROM applications a
    JOIN majors m ON a.majorId = m.id
    JOIN universities u ON a.universityId = u.id
    ${filters.universityId ? "WHERE a.universityId = :universityId" : ""}
    GROUP BY m.id, u.id
    ORDER BY total DESC
  `, filters.universityId ? { replacements: { universityId: filters.universityId } } : {});

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF366092" },
  };

  return workbook;
};

/**
 * Xuất thống kê theo đợt tuyển sinh
 */
exports.exportAdmissionRoundStatisticsToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Thống kê đợt tuyển");

  worksheet.columns = [
    { header: "Đợt tuyển sinh", key: "roundName", width: 30 },
    { header: "Số hồ sơ", key: "total", width: 15 },
  ];

  const [data] = await sequelize.query(`
    SELECT 
      ar.name as roundName,
      COUNT(a.id) as total
    FROM applications a
    JOIN admission_rounds ar ON a.admissionRoundId = ar.id
    GROUP BY ar.id
    ORDER BY total DESC
  `);

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF366092" },
  };

  return workbook;
};

/**
 * Xuất thống kê theo trường đại học
 */
exports.exportUniversityStatisticsToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Thống kê theo trường");

  worksheet.columns = [
    { header: "Trường đại học", key: "universityName", width: 30 },
    { header: "Số hồ sơ", key: "total", width: 15 },
  ];

  const statistics = await repository.countByUniversity();

  statistics.forEach((item) => {
    worksheet.addRow({
      universityName: item.name,
      total: item.total,
    });
  });

  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF366092" },
  };

  return workbook;
};

// ============ CSV EXPORT FUNCTIONS ============

/**
 * Xuất danh sách ứng viên dưới dạng CSV
 */
exports.exportApplicationsToCSV = async (filters = {}) => {
  const applications = await repository.getAllApplicationsDetailed(filters);

  const records = applications.map((app) => ({
    "Mã hồ sơ": app.applicationCode,
    "Họ tên": app.user?.profile?.fullName || "",
    "Email": app.user?.email || "",
    "CCCD": app.user?.profile?.cccd || "",
    "Số điện thoại": app.user?.profile?.phone || "",
    "Trường đại học": app.University?.name || "",
    "Ngành": app.Major?.name || "",
    "Đợt tuyển": app.AdmissionRound?.name || "",
    "Điểm": app.score,
    "Trạng thái": app.status,
    "Ngày tạo": app.createdAt ? app.createdAt.toLocaleDateString("vi-VN") : "",
  }));

  return stringify(records, {
    header: true,
    encoding: "utf8",
    bom: true,
  });
};

/**
 * Xuất thống kê dưới dạng CSV
 */
exports.exportStatisticsToCSV = async (type = "status", filters = {}) => {
  let records = [];

  if (type === "status") {
    const statistics = await repository.countByStatus();
    records = statistics.map((item) => ({
      "Trạng thái": item.status,
      "Số lượng": item.total,
    }));
  } else if (type === "major") {
    const [data] = await sequelize.query(`
      SELECT 
        m.name as majorName,
        u.name as universityName,
        COUNT(a.id) as total
      FROM applications a
      JOIN majors m ON a.majorId = m.id
      JOIN universities u ON a.universityId = u.id
      GROUP BY m.id, u.id
      ORDER BY total DESC
    `);
    records = data.map((item) => ({
      "Ngành học": item.majorName,
      "Trường": item.universityName,
      "Số hồ sơ": item.total,
    }));
  } else if (type === "university") {
    const statistics = await repository.countByUniversity();
    records = statistics.map((item) => ({
      "Trường đại học": item.name,
      "Số hồ sơ": item.total,
    }));
  } else if (type === "admissionRound") {
    const statistics = await repository.countByAdmissionRound();
    records = statistics.map((item) => ({
      "Đợt tuyển sinh": item.name,
      "Số hồ sơ": item.total,
    }));
  }

  return stringify(records, {
    header: true,
    encoding: "utf8",
    bom: true,
  });
};