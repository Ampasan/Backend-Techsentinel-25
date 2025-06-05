const Joi = require("joi");
const fs = require("fs");
const path = require("path");

const userSchema = Joi.object({
  user_name: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "Username harus mengandung huruf kecil dan huruf kapital",
      "string.empty": "Username tidak boleh kosong",
      "any.required": "Username wajib diisi",
    }),
  user_email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email wajib diisi",
    }),
  user_password: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({
      "string.pattern.base": "Password minimal 8 karakter dan harus mengandung huruf kecil, huruf kapital, dan angka",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password wajib diisi",
    }),
});

function validateCreateUser(req, res, next) {
  const { user_name, user_email, user_password } = req.body;

  const data = {
    user_name,
    user_email,
    user_password,
  };

  const { error } = userSchema.validate(data);

  if (error) {
    if (req.file && req.file.path) {
      let uploadedFilePath = path.join(
        __dirname,
        "..",
        req.file.path.replace(/\\/g, "/")
      );
      uploadedFilePath = uploadedFilePath.replace("/middleware", "");

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    const details = error.details.map((detail) => detail.message).join(", ");
    console.error("Validation Error:", details);

    return res.status(400).json({
      success: false,
      message: `Data user tidak valid: ${details}`,
    });
  }

  next();
}

module.exports = validateCreateUser;
