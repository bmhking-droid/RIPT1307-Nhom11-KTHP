const service = require("../services/report.service");

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

exports.exportExcel = async (req, res, next) => {
  try {
    const workbook = await service.exportExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
};
