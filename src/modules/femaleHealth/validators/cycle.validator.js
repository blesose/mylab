const Joi = require("joi");
const validateCycle = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notes: Joi.string().allow(""),
    flowLevel: Joi.string().valid('light', 'medium', 'heavy').optional(),
    symptoms: Joi.array().items(Joi.string()).optional(),
    mood: Joi.string().valid('very-happy', 'happy', 'neutral', 'sad', 'very-sad', 'anxious', 'irritable').optional(),
    energyLevel: Joi.string().valid('very-high', 'high', 'medium', 'low', 'very-low').optional(),
    crampsIntensity: Joi.string().valid('none', 'mild', 'moderate', 'severe', 'debilitating').optional(),
    flowConsistency: Joi.string().valid('normal', 'clotty', 'watery', 'spotting').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { validateCycle };