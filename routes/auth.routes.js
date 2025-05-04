const express = require("express");

const { registerUser, login } = require("../controllers");

const { uploadSingleImage } = require("../middleware/uploadImage");
const validateCreateUser = require("../middleware/validation/create-user.validation");

const router = express.Router();

router.post(
  "/register",
  uploadSingleImage("profile_picture"),
  validateCreateUser,
  registerUser
);

router.post("/login", login);

module.exports = router;