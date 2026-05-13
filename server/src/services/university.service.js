const repository = require(
  "../repositories/university.repository"
);

exports.getAllUniversities = async () => {
  return await repository.findAll();
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