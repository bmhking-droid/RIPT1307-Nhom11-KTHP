const Joi = require("joi");

exports.createApplicationSchema = Joi.object({
  universityId: Joi.string().uuid().required(),

  majorId: Joi.string().uuid().required(),

  combinationId: Joi.string().uuid().required(),

  // BUG FIX: đổi admissionRoundId → roundId để khớp với Application model
  roundId: Joi.string().uuid().required(),

  // BUG FIX: đổi score → totalScore để khớp với Application model
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
