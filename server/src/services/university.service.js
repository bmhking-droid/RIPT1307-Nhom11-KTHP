const repository = require("../repositories/university.repository");

exports.getAllUniversities = async (filters) => {
  return await repository.findAll(filters);
};

exports.createUniversity = async (payload) => {
  return await repository.create(payload);
};

exports.updateUniversity = async (id, payload) => {
  return await repository.update(id, payload);
};

exports.deleteUniversity = async (id) => {
  return await repository.delete(id);
};
