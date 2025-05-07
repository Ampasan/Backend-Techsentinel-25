const express = require('express');

const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers');

const validateUpdateUser = require('../middleware/validation/update-user.validation');

const authorization = require('../middleware/auth.middleware');
const { uploadSingleImage } = require("../middleware/uploadImage");

const router = express.Router();

router.get('/user/profile', authorization(["user", "admin"]), getUserProfile);
router.patch(
  '/user/profile', 
  authorization(["user", "admin"]), 
  uploadSingleImage("profile_picture"), 
  validateUpdateUser, 
  updateUserProfile
);

router.get('/users', authorization(['admin']), getAllUsers);
router.get('/user/:id', authorization(['admin']), getUserById);
router.patch(
  '/user/:id',
  authorization(['admin']),
  uploadSingleImage("profile_picture"),
  validateUpdateUser,
  updateUserById
);
router.delete('/user/:id', authorization(['admin']), deleteUserById);

module.exports = router;
