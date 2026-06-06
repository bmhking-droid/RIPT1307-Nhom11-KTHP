const repository = require("../repositories/admissionRound.repository");
const { AdmissionRound } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (filters) => {
  return await repository.findAll(filters);
};

exports.create = async (payload) => {
  if (new Date(payload.startDate) >= new Date(payload.endDate)) {
    throw new Error("Start date must be before end date");
  }
  if (payload.name) {
    const existingName = await AdmissionRound.findOne({ where: { name: payload.name } });
    if (existingName) {
      throw new Error("Tên đợt tuyển sinh này đã tồn tại trong hệ thống!");
    }
  }
  return await repository.create(payload);
};

exports.update = async (id, payload) => {
  if (payload.name) {
    const existingName = await AdmissionRound.findOne({
      where: {
        name: payload.name,
        id: { [Op.ne]: id }
      }
    });
    if (existingName) {
      throw new Error("Tên đợt tuyển sinh này đã tồn tại trong hệ thống!");
    }
  }
  return await repository.update(id, payload);
};

exports.delete = async (id) => {
  return await repository.delete(id);
};
