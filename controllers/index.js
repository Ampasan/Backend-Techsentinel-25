const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("./user.controllers");

const {
  searchTechnologies,
  getAllTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} = require("./technology.controllers");

const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("./review.controllers");

const {
  compareTechnologies,
  getAllComparisons,
  getComparisonById,
  createComparison,
  updateComparison,
  deleteComparison,
} = require("./comparison.controllers");

const {
  getAllCategories,
  getCategoryById,
  getAllCategoriesWithTechnologies,
  getCategoryByIdWithTechnologies,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./category.controllers");

const {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} = require("./favorite.controllers");

const { registerUser, login, logout } = require("./auth.controllers");

module.exports = {
  // User controllers
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,

  // Technology controllers
  getAllTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  searchTechnologies,

  // Review controllers
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,

  // Comparison controllers
  compareTechnologies,
  getAllComparisons,
  getComparisonById,
  createComparison,
  updateComparison,
  deleteComparison,

  // Category controllers
  getAllCategories,
  getCategoryById,
  getAllCategoriesWithTechnologies,
  getCategoryByIdWithTechnologies,
  createCategory,
  updateCategory,
  deleteCategory,

  // Favorite controllers
  addToFavorites,
  getFavorites,
  removeFromFavorites,

  // Auth controllers
  registerUser,
  login,
  logout,
};
