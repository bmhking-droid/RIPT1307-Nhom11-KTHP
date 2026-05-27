// Report service - generates statistics and exports data for dashboard analytics
const { sequelize } = require("../models");
const repository = require("../repositories/report.repository");
const ExcelJS = require("exceljs");

exports.getStatistics = async () => {
  const byStatus = await repository.countByStatus();
  const byUniversityRaw = await repository.countByUniversity();
  const byUniversity = byUniversityRaw.map((row) => ({
    universityName: row.name,
    total: row.total,
  }));

  const byMajorRaw = await repository.countByMajor();
  const byMajor = byMajorRaw.map((row) => ({
    majorName: row.name,
    total: row.total,
  }));

  // BUG FIX: Calculate totals from byStatus array for correct dashboard display
  const totalApplications = byStatus.reduce((sum, row) => sum + Number(row.total), 0);
  const pendingApplications = byStatus.find((r) => r.status === "pending")?.total || 0;
  const approvedApplications = byStatus.find((r) => r.status === "approved")?.total || 0;
  const rejectedApplications = byStatus.find((r) => r.status === "rejected")?.total || 0;

  return {
    totalApplications,
    pendingApplications: Number(pendingApplications),
    approvedApplications: Number(approvedApplications),
    rejectedApplications: Number(rejectedApplications),
    byStatus,
    byUniversity,
    byMajor,
  };
};

exports.exportExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Statistics");
  worksheet.columns = [{ header: "Status", key: "status", width: 20 }, { header: "Total", key: "total", width: 20 }];

  const statistics = await repository.countByStatus();
  statistics.forEach((item) => { worksheet.addRow(item); });
  return workbook;
};