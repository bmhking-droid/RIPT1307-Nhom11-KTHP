const service = require("../services/university.service");

exports.getAll = async (req, res, next) => {
  try {
    const data =
      await service.getAllUniversities();

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data =
      await service.createUniversity(req.body);

    return res.status(201).json({
      success: true,
      message: "Create university success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data =
      await service.updateUniversity(
        req.params.id,
        req.body
      );

    return res.json({
      success: true,
      message: "Update university success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await service.deleteUniversity(req.params.id);

    return res.json({
      success: true,
      message: "Delete university success",
    });
  } catch (error) {
    next(error);
  }
};