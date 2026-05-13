const repository = require(
  "../repositories/admissionCombination.repository"
);

exports.getAll = async () => {
  return await repository.findAll();
};

exports.create = async (
  payload
) => {
  return await repository.create(
    payload
  );
};

exports.update = async (
  id,
  payload
) => {
  return await repository.update(
    id,
    payload
  );
};

exports.delete = async (id) => {
  return await repository.delete(id);
};