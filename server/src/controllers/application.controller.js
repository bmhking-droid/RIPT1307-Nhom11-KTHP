const sequelize = require("../configs/database");

exports.updateStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const { status, rejectionReason } = req.body;

    const application = await Application.findByPk(id);

    if (!application) {
      throw new Error("Application not found");
    }

    if (
      application.status === "APPROVED" ||
      application.status === "REJECTED"
    ) {
      throw new Error("Final status cannot be changed");
    }

    application.status = status;

    if (status === "REJECTED") {
      application.rejectionReason = rejectionReason;
    }

    await application.save({ transaction });

    await ApplicationStatusHistory.create(
      {
        applicationId: application.id,
        oldStatus: application.status,
        newStatus: status,
        changedBy: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    return res.json({
      success: true,
      message: "Update status success",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};