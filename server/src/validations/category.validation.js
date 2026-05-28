const Joi = require("joi");

exports.createUniversitySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),

  code: Joi.string().min(2).max(50).required(),

  address: Joi.string().max(500).allow("", null),
});

exports.createMajorSchema = Joi.object({
  universityId: Joi.number().required(),

  name: Joi.string().min(2).max(255).required(),

  code: Joi.string().min(2).max(50).required(),

  quota: Joi.number().min(0).required(),
});

exports.createAdmissionRoundSchema = Joi.object({
  universityId: Joi.number().required(),

  name: Joi.string().required(),

  startDate: Joi.date().required(),

  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

exports.createCombinationSchema = Joi.object({
  majorId: Joi.number().required(),

  code: Joi.string().required(),

  subjects: Joi.array().items(Joi.string()).min(3).required(),
});
