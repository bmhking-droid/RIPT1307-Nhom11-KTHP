const { AdmissionCombination } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async () => {
  return await AdmissionCombination.findAll({
    order: [["createdAt", "DESC"]],
  });
};

exports.create = async (payload) => {
  if (payload.code) {
    const existingCode = await AdmissionCombination.findOne({ where: { code: payload.code } });
    if (existingCode) {
      throw new Error("Mã tổ hợp môn đã tồn tại trong hệ thống!");
    }
  }
  if (payload.subjects) {
    const existingSubjects = await AdmissionCombination.findOne({ where: { subjects: payload.subjects } });
    if (existingSubjects) {
      throw new Error("Tổ hợp các môn học này đã tồn tại trong hệ thống!");
    }
  }
  return await AdmissionCombination.create(payload);
};

exports.update = async (id, payload) => {
  const combination = await AdmissionCombination.findByPk(id);

  if (!combination) {
    throw new Error("Admission combination not found");
  }

  if (payload.code) {
    const existingCode = await AdmissionCombination.findOne({
      where: {
        code: payload.code,
        id: { [Op.ne]: id }
      }
    });
    if (existingCode) {
      throw new Error("Mã tổ hợp môn đã tồn tại trong hệ thống!");
    }
  }
  if (payload.subjects) {
    const existingSubjects = await AdmissionCombination.findOne({
      where: {
        subjects: payload.subjects,
        id: { [Op.ne]: id }
      }
    });
    if (existingSubjects) {
      throw new Error("Tổ hợp các môn học này đã tồn tại trong hệ thống!");
    }
  }

  await combination.update(payload);

  return combination;
};

exports.delete = async (id) => {
  const combination = await AdmissionCombination.findByPk(id);

  if (!combination) {
    throw new Error("Admission combination not found");
  }

  await combination.destroy();

  return true;
};
