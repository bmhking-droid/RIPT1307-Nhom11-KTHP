const { Major, University } = require("../models");

exports.findAll = async (filters = {}) => {
  const where = {};

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  return await Major.findAll({
    where,
    include: [
      {
        model: University,
        attributes: ["id", "name", "code"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await Major.findByPk(id);
};

exports.create = async (payload) => {
  return await Major.create(payload);
};

exports.update = async (id, payload) => {
  const major = await Major.findByPk(id);

  if (!major) {
    throw new Error("Major not found");
  }

  await major.update(payload);

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
