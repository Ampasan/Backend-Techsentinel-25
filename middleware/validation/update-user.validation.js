const Joi = require("joi");

const userSchema = Joi.object({
  user_name: Joi.string()
    .optional()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "Nama hanya boleh mengandung huruf dan spasi"
    }),
  user_email: Joi.string()
    .optional()
    .email()
    .messages({
      "string.email": "Format email tidak valid"
    }),
  id_level: Joi.string()
    .optional()
    .pattern(/^A[0-9]{3}$/)
    .messages({
      "string.pattern.base": "Format level tidak valid"
    })
});

function validateUpdateUser(req, res, next) {
  const { user_name, user_email, id_level } = req.body;

  const data = {
    user_name,
    user_email,
    id_level
  };

  const { error } = userSchema.validate(data);

  if (error) {
    const details = error.details.map((detail) => detail.message).join(", ");
    return res
      .status(400)
      .json({ success: false, message: `Data user tidak valid: ${details}` });
  }

  next();
}

module.exports = validateUpdateUser;