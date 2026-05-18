const Joi = require("joi");

exports.createApplicationSchema = Joi.object({
  universityId: Joi.number().required(),

  majorId: Joi.number().required(),

  combinationId: Joi.number().required(),

  admissionRoundId: Joi.number().required(),

  score: Joi.number().min(0).max(30).precision(2).required(),

  priorityType: Joi.string().allow("", null),

  documents: Joi.array()
    .items(
      Joi.object({
        documentType: Joi.string().required(),
        fileName: Joi.string().required(),
        filePath: Joi.string().required(),
        mimeType: Joi.string().optional(),
        fileSize: Joi.number().optional(),
      }),
    )
    .min(1)
    .optional(),
});
