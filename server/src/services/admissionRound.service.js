const { AdmissionRound } = require("../models");

exports.getAll = async () => {
  return await AdmissionRound.findAll({
    order: [["createdAt", "DESC"]],
  });
};

exports.create = async (payload) => {
  if (new Date(payload.startDate) >= new Date(payload.endDate)) {
    throw new Error("Start date must be before end date");
  }

  return await AdmissionRound.create(payload);
};

exports.update = async (id, payload) => {
  const round = await AdmissionRound.findByPk(id);

  if (!round) {
    throw new Error("Admission round not found");
  }

  await round.update(payload);

  return round;
};

exports.delete = async (id) => {
  const round = await AdmissionRound.findByPk(id);

  if (!round) {
    throw new Error("Admission round not found");
  }

  await round.destroy();

  return true;
};
