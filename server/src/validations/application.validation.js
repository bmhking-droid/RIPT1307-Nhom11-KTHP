const Joi = require("joi");

exports.createApplicationSchema = Joi.object({
  universityId: Joi.string().uuid().required(),

  majorId: Joi.string().uuid().required(),

  combinationId: Joi.string().uuid().required(),

  roundId: Joi.string().uuid().required(),

  totalScore: Joi.number().min(0).max(30).precision(2).optional(),

  priorityType: Joi.string().allow("", null),

  documents: Joi.array()
    .items(
      Joi.object({
        documentType: Joi.string().required(),
        fileUrl: Joi.string().required(),
        originalName: Joi.string().optional(),
        fileSize: Joi.number().optional(),
      }),
    )
    .min(1)
    .optional(),
});
