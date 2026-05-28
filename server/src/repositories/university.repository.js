const { University } = require("../models");

exports.findAll = async (filters = {}) => {
  const where = {};
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }
  return await University.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await University.findByPk(id);
};

exports.create = async (payload) => {
  return await University.create(payload);
};

exports.update = async (id, payload) => {
  const university = await University.findByPk(id);

  if (!university) {
    throw new Error("University not found");
  }

  await university.update(payload);

  return university;
};

exports.delete = async (id) => {
  const university = await University.findByPk(id);

  if (!university) {
    throw new Error("University not found");
  }

  await university.destroy();

  return true;
};
