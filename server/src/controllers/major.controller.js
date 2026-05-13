const service = require("../services/major.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAllMajors(
      req.query
    );

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
    const data = await service.createMajor(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Create major success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.updateMajor(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Update major success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await service.deleteMajor(req.params.id);

    return res.json({
      success: true,
      message: "Delete major success",
    });
  } catch (error) {
    next(error);
  }
};