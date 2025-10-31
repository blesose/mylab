const Joi = require("joi");

const reactionValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
    "any.required": "userId is required",
  }),

  postId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null),

  commentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null),

  type: Joi.string()
    .valid("like", "love", "insightful", "support", "celebrate")
    .required()
    .messages({
      "any.only":
        "Reaction type must be one of: like, love, insightful, support, celebrate",
      "any.required": "Reaction type is required",
    }),
}).xor("postId", "commentId"); // must react to either a post OR a comment

module.exports = { reactionValidator };
