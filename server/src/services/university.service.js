const repository = require("../repositories/university.repository");
const { University } = require("../models");
const { Op } = require("sequelize");

exports.getAllUniversities = async (filters) => {
  return await repository.findAll(filters);
};

exports.createUniversity = async (payload) => {
  if (payload.code) {
    const existingCode = await University.findOne({ where: { code: payload.code } });
    if (existingCode) {
      throw new Error("Mã trường học đã tồn tại trong hệ thống!");
    }
  }
  if (payload.name) {
    const existingName = await University.findOne({ where: { name: payload.name } });
    if (existingName) {
      throw new Error("Tên trường học đã tồn tại trong hệ thống!");
    }
  }
  return await repository.create(payload);
};

exports.updateUniversity = async (id, payload) => {
  if (payload.code) {
    const existingCode = await University.findOne({
      where: {
        code: payload.code,
        id: { [Op.ne]: id }
      }
    });
    if (existingCode) {
      throw new Error("Mã trường học đã tồn tại trong hệ thống!");
    }
  }
  if (payload.name) {
    const existingName = await University.findOne({
      where: {
        name: payload.name,
        id: { [Op.ne]: id }
      }
    });
    if (existingName) {
      throw new Error("Tên trường học đã tồn tại trong hệ thống!");
    }
  }
  return await repository.update(id, payload);
};

exports.deleteUniversity = async (id) => {
  return await repository.delete(id);
};
