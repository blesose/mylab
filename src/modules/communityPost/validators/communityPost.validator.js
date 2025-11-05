const Joi = require("joi");

const createPostValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(200),
    content: Joi.string().required().min(10),
    tags: Joi.array().items(Joi.string()),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

module.exports = { createPostValidator };

