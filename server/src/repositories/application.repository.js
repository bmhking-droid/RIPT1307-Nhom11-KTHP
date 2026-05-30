const { sequelize, Application, University, Major, Profile, AdmissionRound, AdmissionCombination, ApplicationDocument, ApplicationStatusHistory, User } = require("../models");
const { Op } = sequelize.Sequelize;

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

  if (filters.keyword) {
    const keyword = String(filters.keyword).trim();
    
    // Find matching users first to avoid Sequelize's pagination subquery bug
    // (Unknown column 'User.email' in 'where clause')
    const matchedUsers = await User.findAll({
      attributes: ["id"],
      include: [{
        model: Profile,
        as: "profile",
        attributes: []
      }],
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${keyword}%` } },
          { "$profile.fullName$": { [Op.like]: `%${keyword}%` } },
          { "$profile.cccd$": { [Op.like]: `%${keyword}%` } }
        ]
      }
    });

    const userIds = matchedUsers.map(u => u.id);

    where[Op.or] = [
      { id: { [Op.like]: `%${keyword}%` } }
    ];

    if (userIds.length > 0) {
      where[Op.or].push({ userId: { [Op.in]: userIds } });
    }
  }

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
