// src/middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(
      {
        ...req.body,
        ...req.params,
        ...req.query,
      },
      { abortEarly: false }
    );

    if (error) {
      const errors = error.details.map((ele) => ({
        message: ele.message,
        field: ele.path[0],
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next();
  };
};

module.exports = { validate };
