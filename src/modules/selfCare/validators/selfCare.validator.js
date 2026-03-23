const Joi = require("joi");

const selfCareValidator = (req, res, next) => {
  const schema = Joi.object({
    activityType: Joi.string().valid(
      "meditation", "journaling", "sleep", "skinCare", "mindfulness", "other",
      "reading", "exercise", "music", "nature", "social", "hobby", 
      "relaxation", "self_reflection"
    ).required(),
    
    activity: Joi.string().optional(), // Add if you include this field
    
    duration: Joi.number().min(1).max(1440).required(),
    
    moodBefore: Joi.number().min(1).max(10).optional(),
    moodAfter: Joi.number().min(1).max(10).optional(),
    
    satisfaction: Joi.number().min(1).max(10).optional(), // Add if needed
    
    notes: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }

  next();
};

module.exports = { selfCareValidator };