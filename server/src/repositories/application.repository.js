const {
  Application,
  University,
  Major,
  Profile,
  AdmissionRound,
  AdmissionCombination,
  ApplicationDocument,
  ApplicationStatusHistory,
  User,
} = require("../models");

const { Op } = require("sequelize");

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
      {
        model: ApplicationStatusHistory,
      },
      {
        model: User,
        include: [{ model: Profile, as: "profile" }],
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
      {
        model: ApplicationStatusHistory,
      },
      {
        model: ApplicationDocument,
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
    where.universityId = filters.universityId;
  }

  if (filters.majorId) {
    where.majorId = filters.majorId;
  }

  if (filters.keyword) {
    where[Op.or] = [
      {
        applicationCode: {
          [Op.like]: `%${filters.keyword}%`,
        },
      },
    ];
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const offset = (page - 1) * limit;

  return await Application.findAndCountAll({
    where,
    include: [
      {
        model: University,
      },
      {
        model: Major,
      },
      {
        model: ApplicationStatusHistory,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
};

exports.updateStatus = async (application, payload, transaction) => {
  return await application.update(payload, {
    transaction,
  });
};
