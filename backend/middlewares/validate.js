const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      type: "VALIDATION_ERROR",
      message: "Validation failed.",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
};

module.exports = validate;
