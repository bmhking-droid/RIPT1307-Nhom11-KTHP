const {
  AdmissionCombination,
} = require("../models");

exports.getAll = async () => {
  return await AdmissionCombination.findAll({
    order: [["createdAt", "DESC"]],
  });
};

exports.create = async (payload) => {
  return await AdmissionCombination.create(
    payload
  );
};

exports.update = async (id, payload) => {
  const combination =
    await AdmissionCombination.findByPk(id);

  if (!combination) {
    throw new Error(
      "Admission combination not found"
    );
  }

  await combination.update(payload);

  return combination;
};

exports.delete = async (id) => {
  const combination =
    await AdmissionCombination.findByPk(id);

  if (!combination) {
    throw new Error(
      "Admission combination not found"
    );
  }

  await combination.destroy();

  return true;
};