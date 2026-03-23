const Joi = require("joi");
const createOvulationValidator = (req, res, next) => {
  const schema = Joi.object({
    // Match your MongoDB schema
    userId: Joi.string().required().messages({
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    }),
    
    // Change from startDate to cycleStart
    cycleStart: Joi.date().required().messages({
      'date.base': 'Cycle start date must be a valid date',
      'any.required': 'Cycle start date is required'
    }),
    
    // Remove endDate requirement since it's not in your model
    cycleLength: Joi.number().min(20).max(40).default(28).required().messages({
      'number.base': 'Cycle length must be a number',
      'number.min': 'Cycle length must be at least 20 days',
      'number.max': 'Cycle length cannot exceed 40 days',
      'any.required': 'Cycle length is required'
    }),
    
    // Add ovulationDate (from your model)
    ovulationDate: Joi.date().optional(),
    
    // Add fertile window dates (from your model)
    fertileWindowStart: Joi.date().optional(),
    fertileWindowEnd: Joi.date().optional(),
    
    // Notes (from your model)
    notes: Joi.string().allow("").default(""),
    
    // Remove other fields that aren't in your model
    // endDate: Joi.date().required(), // REMOVE THIS
    // flowLevel: Joi.string(), // REMOVE THIS
    // ... etc.
    
  }).options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body);
  
  if (error) {
    console.error('❌ Validation error:', error.details);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      error: error.details[0].message,
      details: error.details 
    });
  }
  
  req.body = value;
  next();
};

module.exports = { createOvulationValidator };