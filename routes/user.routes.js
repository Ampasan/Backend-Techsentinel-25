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

const router = express.Router();

router.get('/user/profile', getUserProfile);
router.put('/user/profile', validateUpdateUser, updateUserProfile);

router.get('/users', authorization(['admin']), getAllUsers);
router.get('/user/:id', authorization(['admin']), getUserById);
router.put(
  '/user/:id',
  authorization(['admin']),
  validateUpdateUser,
  updateUserById
);
router.delete('/user/:id', authorization(['admin']), deleteUserById);

module.exports = router;
