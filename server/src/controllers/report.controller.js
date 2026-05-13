const service = require(
  "../services/report.service"
);

exports.statistics = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await service.getStatistics();

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const {
  limit,
  offset,
} = getPagination(
  filters.page,
  filters.limit
);

return await Application.findAndCountAll({
  where,
  limit,
  offset,
});

exports.exportExcel = async (
  req,
  res,
  next
) => {
  try {
    const workbook =
      await service.exportExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
};