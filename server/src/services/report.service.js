const { sequelize } = require("../models");

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

const ExcelJS = require("exceljs");

exports.exportExcel = async () => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Statistics");

  worksheet.columns = [
    {
      header: "Status",
      key: "status",
      width: 20,
    },
    {
      header: "Total",
      key: "total",
      width: 20,
    },
  ];

  const statistics = await repository.countByStatus();

  statistics.forEach((item) => {
    worksheet.addRow(item);
  });

  return workbook;
};
