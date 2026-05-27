const { AdmissionRound } = require("../models");

exports.findAll = async (filters = {}) => {
  const where = {};
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }
  return await AdmissionRound.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await AdmissionRound.findByPk(id);
};

exports.create = async (payload) => {
  return await AdmissionRound.create(payload);
};

exports.update = async (id, payload) => {
  const round = await AdmissionRound.findByPk(id);
  if (!round) throw new Error("Admission round not found");
  await round.update(payload);
  return round;
};

exports.delete = async (id) => {
  const round = await AdmissionRound.findByPk(id);
  if (!round) throw new Error("Admission round not found");
  await round.destroy();
  return true;
};
