// Application repository - manages application data with related entity associations
const { Application, University, Major, Profile, AdmissionRound, AdmissionCombination, ApplicationDocument, ApplicationStatusHistory, User } = require("../models");

exports.create = async (payload, transaction) => {
  return await Application.create(payload, { transaction });
};

exports.findById = async (id) => {
  return await Application.findByPk(id, {
    include: [
      { model: University },
      { model: Major },
      { model: AdmissionRound },
      { model: AdmissionCombination },
      { model: ApplicationDocument, as: "documents" },
      { model: ApplicationStatusHistory, as: "statusHistories" },
      { model: User, include: [{ model: Profile, as: "profile" }] }
    ],
  });
};

exports.findByUserId = async (userId) => {
  return await Application.findAll({
    where: { userId },
    include: [
      { model: University, attributes: ["id", "name"] },
      { model: Major, attributes: ["id", "name"] },
      { model: AdmissionRound },
      { model: AdmissionCombination },
      { model: ApplicationStatusHistory, as: "statusHistories" },
      { model: ApplicationDocument, as: "documents" }
    ],
    order: [["submittedAt", "DESC"]],
  });
};

exports.findAll = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.universityId) where.universityId = filters.universityId;
  if (filters.majorId) where.majorId = filters.majorId;
  if (filters.roundId) where.roundId = filters.roundId;

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const offset = (page - 1) * limit;

  return await Application.findAndCountAll({
    where,
    include: [
      { model: University },
      { model: Major },
      { model: AdmissionRound },
      { model: AdmissionCombination },
      { model: User, include: [{ model: Profile, as: "profile" }] },
      { model: ApplicationStatusHistory, as: "statusHistories" }
    ],
    order: [["submittedAt", "DESC"]],
    limit,
    offset,
  });
};

exports.updateStatus = async (application, payload, transaction) => {
  return await application.update(payload, { transaction });
};