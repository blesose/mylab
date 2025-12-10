const Joi = require("joi");

const selfCareValidator = (req, res, next) => {
const schema = Joi.object({
  userId: Joi.string().required(),
  activityType: Joi.string().valid("meditation", "journaling", "sleep", "skinCare", "mindfulness", "other").required(),
  duration: Joi.number().min(5).max(300).required(),
  moodBefore: Joi.string().valid("happy", "neutral", "sad", "stressed"),
  moodAfter: Joi.string().valid("happy", "neutral", "sad", "stressed"),
  notes: Joi.string().allow(""),
});

const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

module.exports = { selfCareValidator };