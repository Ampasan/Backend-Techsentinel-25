const Joi = require("joi");

const userSchema = Joi.object({
  user_name: Joi.string()
    .required()
    .pattern(/^[a-zA-Z\s]+$/),
  user_birthday: Joi.date().required(),
});

function validateUpdateUser(req, res, next) {
  const { user_name,} = req.body;

  const data = {
    user_name,
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