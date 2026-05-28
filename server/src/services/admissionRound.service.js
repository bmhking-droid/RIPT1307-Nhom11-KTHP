const repository = require("../repositories/admissionRound.repository");

exports.getAll = async (filters) => {
  return await repository.findAll(filters);
};

exports.create = async (payload) => {
  if (new Date(payload.startDate) >= new Date(payload.endDate)) {
    throw new Error("Start date must be before end date");
  }
  return await repository.create(payload);
};

exports.update = async (id, payload) => {
  return await repository.update(id, payload);
};

exports.delete = async (id) => {
  return await repository.delete(id);
};
