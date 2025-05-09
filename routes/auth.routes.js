const express = require("express");

const { registerUser, login, logout } = require("../controllers");

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
router.post("/logout", logout);

module.exports = router;