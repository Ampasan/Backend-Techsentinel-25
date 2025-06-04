const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/review.controllers");

const router = express.Router();

// Public routes
router.get("/reviews", getAllReviews);
router.get("/review/:id", getReviewById);

// User and admin routes
router.post("/review/new", authorization(["user", "admin"]), createReview);
router.patch("/review/:id", authorization(["user", "admin"]), updateReview);
router.delete("/review/:id", authorization(["user", "admin"]), deleteReview);

module.exports = router;
