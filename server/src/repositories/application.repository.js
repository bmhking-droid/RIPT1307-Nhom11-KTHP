const {
  Application,
  University,
  Major,
  AdmissionRound,
  AdmissionCombination,
  ApplicationDocument,
} = require("../models");

exports.create = async (payload, transaction) => {
  return await Application.create(payload, {
    transaction,
  });
};

exports.findById = async (id) => {
  return await Application.findByPk(id, {
    include: [
      {
        model: University,
      },
      {
        model: Major,
      },
      {
        model: AdmissionRound,
      },
      {
        model: AdmissionCombination,
      },
      {
        model: ApplicationDocument,
      },
    ],
  });
};

exports.findByUserId = async (userId) => {
  return await Application.findAll({
    where: { userId },

    include: [
      {
        model: University,
        attributes: ["id", "name"],
      },
      {
        model: Major,
        attributes: ["id", "name"],
      },
    ],

    order: [["createdAt", "DESC"]],
  });
};

exports.findAll = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.universityId) {
    where.universityId =
      filters.universityId;
  }

  if (filters.majorId) {
    where.majorId = filters.majorId;
  }

  return await Application.findAll({
    where,

    include: [
      {
        model: University,
      },
      {
        model: Major,
      },
    ],

    order: [["createdAt", "DESC"]],
  });
};

exports.updateStatus = async (
  application,
  payload,
  transaction
) => {
  return await application.update(payload, {
    transaction,
  });
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