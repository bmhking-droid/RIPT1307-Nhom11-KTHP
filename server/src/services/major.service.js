const repository = require("../repositories/major.repository");
const { University, Major } = require("../models");
const { Op } = require("sequelize");

exports.getAllMajors = async (filters) => {
  return await repository.findAll(filters);
};

exports.createMajor = async (payload) => {
  const university = await University.findByPk(payload.universityId);
  if (!university) {
    throw new Error("University not found");
  }

  if (payload.code) {
    const existingCode = await Major.findOne({ where: { code: payload.code } });
    if (existingCode) {
      throw new Error("Mã ngành học đã tồn tại trong hệ thống!");
    }
  }

  if (payload.name) {
    const existingName = await Major.findOne({
      where: {
        name: payload.name,
        universityId: payload.universityId
      }
    });
    if (existingName) {
      throw new Error("Tên ngành học này đã tồn tại trong trường đại học được chọn!");
    }
  }

  return await repository.create(payload);
};

exports.updateMajor = async (id, payload) => {
  const major = await Major.findByPk(id);
  if (!major) {
    throw new Error("Major not found");
  }

  const universityId = payload.universityId || major.universityId;

  if (payload.code) {
    const existingCode = await Major.findOne({
      where: {
        code: payload.code,
        id: { [Op.ne]: id }
      }
    });
    if (existingCode) {
      throw new Error("Mã ngành học đã tồn tại trong hệ thống!");
    }
  }

  if (payload.name) {
    const existingName = await Major.findOne({
      where: {
        name: payload.name,
        universityId,
        id: { [Op.ne]: id }
      }
    });
    if (existingName) {
      throw new Error("Tên ngành học này đã tồn tại trong trường đại học được chọn!");
    }
  }

  return await repository.update(id, payload);
};

exports.deleteMajor = async (id) => {
  return await repository.delete(id);
};
