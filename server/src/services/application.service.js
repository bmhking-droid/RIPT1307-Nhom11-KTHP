const sequelize = require("../configs/database");

const repository = require(
  "../repositories/application.repository"
);

const {
  University,
  Major,
  AdmissionRound,
  AdmissionCombination,
  ApplicationDocument,
  ApplicationStatusHistory,
  Application,
} = require("../models");

const generateApplicationCode = require(
  "../utils/generateApplicationCode"
);

const {
  APPLICATION_STATUS,
} = require("../utils/constants");

exports.createApplication = async (
  userId,
  payload
) => {
  const transaction =
    await sequelize.transaction();

  try {
    // Validate university
    const university =
      await University.findByPk(
        payload.universityId
      );

    if (!university) {
      throw new Error(
        "University not found"
      );
    }

    // Validate major belongs to university
    const major = await Major.findOne({
      where: {
        id: payload.majorId,
        universityId:
          payload.universityId,
      },
    });

    if (!major) {
      throw new Error(
        "Major does not belong to university"
      );
    }

    // Validate round
    const round =
      await AdmissionRound.findByPk(
        payload.admissionRoundId
      );

    if (!round) {
      throw new Error(
        "Admission round not found"
      );
    }

    const now = new Date();

    if (
      now < round.startDate ||
      now > round.endDate
    ) {
      throw new Error(
        "Admission round is closed"
      );
    }

    // Validate combination
    const combination =
      await AdmissionCombination.findByPk(
        payload.combinationId
      );

    if (!combination) {
      throw new Error(
        "Admission combination not found"
      );
    }

    // Generate code
    const applicationCode =
      await generateApplicationCode(
        Application
      );

    // Create application
    const application =
      await repository.create(
        {
          ...payload,
          userId,
          applicationCode,
          status:
            APPLICATION_STATUS.PENDING,
        },
        transaction
      );

    // Create status history
    await ApplicationStatusHistory.create(
      {
        applicationId: application.id,
        oldStatus: null,
        newStatus:
          APPLICATION_STATUS.PENDING,
        changedBy: userId,
      },
      { transaction }
    );

    await transaction.commit();

    return application;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

exports.getMyApplications = async (
  userId
) => {
  return await repository.findByUserId(
    userId
  );
};

exports.getApplicationDetail = async (
  id,
  user
) => {
  const application =
    await repository.findById(id);

  if (!application) {
    throw new Error(
      "Application not found"
    );
  }

  // Candidate chỉ xem hồ sơ của mình
  if (
    user.role === "CANDIDATE" &&
    application.userId !== user.id
  ) {
    throw new Error("Access denied");
  }

  return application;
};

exports.updateStatus = async (
  id,
  payload,
  adminId
) => {
  const transaction =
    await sequelize.transaction();

  try {
    const application =
      await repository.findById(id);

    if (!application) {
      throw new Error(
        "Application not found"
      );
    }

    // Không cho sửa final status
    if (
      application.status ===
        APPLICATION_STATUS.APPROVED ||
      application.status ===
        APPLICATION_STATUS.REJECTED
    ) {
      throw new Error(
        "Cannot change final status"
      );
    }

    // Validate status
    const allowedStatuses = [
      APPLICATION_STATUS.APPROVED,
      APPLICATION_STATUS.REJECTED,
    ];

    if (
      !allowedStatuses.includes(
        payload.status
      )
    ) {
      throw new Error(
        "Invalid status"
      );
    }

    const oldStatus =
      application.status;

    await repository.updateStatus(
      application,
      {
        status: payload.status,
        rejectionReason:
          payload.rejectionReason ||
          null,
      },
      transaction
    );

    // Log history
    await ApplicationStatusHistory.create(
      {
        applicationId: application.id,
        oldStatus,
        newStatus: payload.status,
        changedBy: adminId,
      },
      { transaction }
    );

    await transaction.commit();

    return application;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const {
  writeLog,
} = require("../utils/logger");

writeLog(
  "application.log",
  `Create application ${application.applicationCode}`
);

writeLog(
  "application.log",
  `Application ${application.applicationCode} updated to ${payload.status}`
);