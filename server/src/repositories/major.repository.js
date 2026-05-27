const { Major, University, AdmissionCombination } = require("../models");

exports.findAll = async (filters = {}) => {
  const where = {};

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }

  return await Major.findAll({
    where,
    include: [
      {
        model: University,
        attributes: ["id", "name", "code"],
      },
      {
        model: AdmissionCombination,
        attributes: ["id", "code", "subjects"],
        through: { attributes: [] }
      }
    ],
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await Major.findByPk(id, {
    include: [
      {
        model: AdmissionCombination,
        attributes: ["id", "code", "subjects"],
        through: { attributes: [] }
      }
    ]
  });
};

exports.create = async (payload) => {
  const { combinationIds, ...majorData } = payload;
  const major = await Major.create(majorData);
  if (combinationIds && combinationIds.length > 0) {
    await major.setAdmissionCombinations(combinationIds);
  }
  return major;
};

exports.update = async (id, payload) => {
  const major = await Major.findByPk(id);

  if (!major) {
    throw new Error("Major not found");
  }

  const { combinationIds, ...majorData } = payload;
  await major.update(majorData);

  if (combinationIds !== undefined) {
    await major.setAdmissionCombinations(combinationIds || []);
  }

  return major;
};

exports.delete = async (id) => {
  const major = await Major.findByPk(id);

  if (!major) {
    throw new Error("Major not found");
  }

  await major.destroy();

  return true;
};
