const Joi = require("joi");

exports.createApplicationSchema = Joi.object({
  universityId: Joi.number().required(),

  majorId: Joi.number().required(),

  combinationId: Joi.number().required(),

  admissionRoundId: Joi.number().required(),

  score: Joi.number().min(0).max(30).precision(2).required(),

  priorityType: Joi.string().allow("", null),
});