const service = require("../services/admissionCombination.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();

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
    const data = await service.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Create admission combination success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);

    return res.json({
      success: true,
      message: "Update admission combination success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.params.id);

    return res.json({
      success: true,
      message: "Delete admission combination success",
    });
  } catch (error) {
    next(error);
  }
};
