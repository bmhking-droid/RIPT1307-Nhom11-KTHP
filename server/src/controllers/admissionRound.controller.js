const service = require("../services/admissionRound.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);

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
      message: "Create admission round success",
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
      message: "Update admission round success",
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
      message: "Delete admission round success",
    });
  } catch (error) {
    next(error);
  }
};
