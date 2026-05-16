const repository = require(
  "../repositories/major.repository"
);

const { University } = require("../models");

exports.getAllMajors = async (filters) => {
  return await repository.findAll(filters);
};

exports.createMajor = async (payload) => {
  const university = await University.findByPk(
    payload.universityId
  );

  if (!university) {
    throw new Error("University not found");
  }

  return await repository.create(payload);
};

exports.updateMajor = async (id, payload) => {
  return await repository.update(id, payload);
};

exports.deleteMajor = async (id) => {
  return await repository.delete(id);
};