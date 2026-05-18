const applicationService = require("../services/application.service");

exports.create = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(
      req.user.id,
    );

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationDetail(
      req.params.id,
      req.user,
    );

    return res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const application = await applicationService.updateStatus(
      req.params.id,
      req.body,
      req.user.id,
    );

    return res.json({
      success: true,
      data: application,
      message: "Update status success",
    });
  } catch (error) {
    next(error);
  }
};
