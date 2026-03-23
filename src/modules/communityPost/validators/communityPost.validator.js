const Joi = require("joi");
/**
 * Validator for creating a new post
 */
const createPostValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .optional()
      .min(3)
      .max(200)
      .trim()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 200 characters',
      }),
    content: Joi.string()
      .required()
      .min(10)
      .max(5000)
      .trim()
      .messages({
        'string.empty': 'Content is required',
        'string.min': 'Content must be at least 10 characters long',
        'string.max': 'Content cannot exceed 5000 characters',
        'any.required': 'Content is required',
      }),
    tags: Joi.array()
      .items(Joi.string().trim().max(50))
      .optional()
      .max(10)
      .messages({
        'array.max': 'You can add up to 10 tags only',
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      success: false, 
      message: errors.join(', '),
      errors: errors 
    });
  }
  
  next();
};

/**
 * Validator for adding a comment
 */
const commentValidator = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string()
      .required()
      .min(1)
      .max(1000)
      .trim()
      .messages({
        'string.empty': 'Comment text is required',
        'string.min': 'Comment cannot be empty',
        'string.max': 'Comment cannot exceed 1000 characters',
        'any.required': 'Comment text is required',
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      success: false, 
      message: errors.join(', '),
      errors: errors 
    });
  }
  
  next();
};

/**
 * Validator for MongoDB ObjectId params (optional but recommended)
 */
const validatePostId = (req, res, next) => {
  const { id, postId } = req.params;
  const idToValidate = id || postId;

  if (!idToValidate) {
    return res.status(400).json({
      success: false,
      message: 'Post ID is required',
    });
  }

  // Check if it's a valid MongoDB ObjectId
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(idToValidate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid post ID format',
    });
  }

  next();
};

module.exports = { 
  createPostValidator, 
  commentValidator,
  validatePostId 
};