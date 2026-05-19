const sequelize = require("../configs/database");

const repository = require("../repositories/application.repository");

const {
  University,
  Major,
  AdmissionRound,
  AdmissionCombination,
  ApplicationDocument,
  ApplicationStatusHistory,
  Application,
} = require("../models");

const mailService = require("./mail.service");
const { APPLICATION_STATUS } = require("../utils/constants");

const generateApplicationCode = () => {
  const timestamp = Date.now();
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `APP-${timestamp}-${suffix}`;
};

exports.createApplication = async (userId, payload) => {
  const transaction = await sequelize.transaction();

  try {
    const university = await University.findByPk(payload.universityId);
    if (!university) {
      throw new Error("University not found");
    }

    const major = await Major.findOne({
      where: {
        id: payload.majorId,
        universityId: payload.universityId,
      },
    });

    if (!major) {
      throw new Error("Major does not belong to university");
    }

    const round = await AdmissionRound.findByPk(payload.admissionRoundId);
    if (!round) {
      throw new Error("Admission round not found");
    }

    const now = new Date();
    if (now < round.startDate || now > round.endDate) {
      throw new Error("Admission round is closed");
    }

    const combination = await AdmissionCombination.findByPk(
      payload.combinationId,
    );
    if (!combination) {
      throw new Error("Admission combination not found");
    }

    const applicationCode = await generateApplicationCode(Application);

    const application = await repository.create(
      {
        ...payload,
        userId,
        applicationCode,
        status: APPLICATION_STATUS.PENDING,
      },
      transaction,
    );

    if (Array.isArray(payload.documents) && payload.documents.length) {
      const documents = payload.documents.map((document) => ({
        applicationId: application.id,
        documentType: String(document.documentType).toUpperCase(),
        fileName: document.fileName,
        filePath: document.filePath,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
      }));

      await ApplicationDocument.bulkCreate(documents, { transaction });
    }

    await ApplicationStatusHistory.create(
      {
        applicationId: application.id,
        oldStatus: null,
        newStatus: APPLICATION_STATUS.PENDING,
        changedBy: userId,
      },
      { transaction },
    );

    await transaction.commit();

    return application;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getMyApplications = async (userId) => {
  return await repository.findByUserId(userId);
};

exports.getApplicationDetail = async (id, user) => {
  const application = await repository.findById(id);

  if (!application) {
    throw new Error("Application not found");
  }

  if (user.role === "CANDIDATE" && application.userId !== user.id) {
    throw new Error("Access denied");
  }

  return application;
};

exports.updateStatus = async (id, payload, adminId) => {
  const transaction = await sequelize.transaction();

  try {
    const application = await repository.findById(id);

    if (!application) {
      throw new Error("Application not found");
    }

    if (
      application.status === APPLICATION_STATUS.APPROVED ||
      application.status === APPLICATION_STATUS.REJECTED
    ) {
      throw new Error("Cannot change final status");
    }

    const allowedStatuses = [
      APPLICATION_STATUS.APPROVED,
      APPLICATION_STATUS.REJECTED,
    ];

    if (!allowedStatuses.includes(payload.status)) {
      throw new Error("Invalid status");
    }

    const oldStatus = application.status;

    await repository.updateStatus(
      application,
      {
        status: payload.status,
        rejectionReason: payload.rejectionReason || null,
      },
      transaction,
    );

    await ApplicationStatusHistory.create(
      {
        applicationId: application.id,
        oldStatus,
        newStatus: payload.status,
        changedBy: adminId,
      },
      { transaction },
    );

    await transaction.commit();

    if (application.user && application.user.email) {
      await mailService.sendApplicationStatusEmail(
        application.user.email,
        payload.status,
        payload.rejectionReason,
      );
    }

    return application;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
