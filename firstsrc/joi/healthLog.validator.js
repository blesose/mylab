const Joi = require("joi");

// Reusable ObjectId validation
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Schema for details depending on logType
const detailSchemas = {
  femaleHealth: Joi.object({
    cycleStartDate: Joi.date().required(),
    cycleEndDate: Joi.date().optional(),
    symptoms: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().max(300).optional(),
  }),

  mensHealth: Joi.object({
    energyLevel: Joi.number().min(1).max(10).required(),
    performanceNotes: Joi.string().max(300).optional(),
  }),

  mentalHealth: Joi.object({
    stressLevel: Joi.number().min(1).max(10).required(),
    anxietyLevel: Joi.number().min(1).max(10).optional(),
    notes: Joi.string().max(300).optional(),
  }),

  selfCare: Joi.object({
    sleepHours: Joi.number().min(0).max(24).required(),
    hydrationLiters: Joi.number().min(0).max(10).required(),
    mindfulMinutes: Joi.number().min(0).max(300).optional(),
  }),

  fitnessNutrition: Joi.object({
    workoutTypes: Joi.string().trim().required(),
    durationMinutes: Joi.number().min(1).max(300).optional(),
    caloriesBurned: Joi.number().min(0).optional(),
    mealType: Joi.string()
      .valid("breakfast", "lunch", "dinner", "snack")
      .optional(),
    caloriesConsumed: Joi.number().min(0).optional(),
  }),
};

// Base validator
const healthLogValidator = Joi.object({
  userId: Joi.string().required().pattern(objectIdPattern).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
  }),

  logType: Joi.string()
    .valid(
      "femaleHealth",
      "mensHealth",
      "mentalHealth",
      "selfCare",
      "fitnessNutrition"
    )
    .required(),

  mood: Joi.string()
    .valid("happy", "neutral", "sad", "stressed", "anxious", "energetic")
    .default("neutral"),

  details: Joi.alternatives().conditional("logType", {
    switch: [
      { is: "femaleHealth", then: detailSchemas.femaleHealth },
      { is: "mensHealth", then: detailSchemas.mensHealth },
      { is: "mentalHealth", then: detailSchemas.mentalHealth },
      { is: "selfCare", then: detailSchemas.selfCare },
      { is: "fitnessNutrition", then: detailSchemas.fitnessNutrition },
    ],
    otherwise: Joi.forbidden(), // if logType is not valid, reject
  }),
});

module.exports = { healthLogValidator };
