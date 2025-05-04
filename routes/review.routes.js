const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
} = require("../controllers");

const { uploadSingleImage } = require("../middleware/uploadImage");

const router = express.Router();

router.get("/reviews", getAllReviews);
router.get("/review/:id", getReviewById);

router.post(
    "/review/new",
    authorization(["admin"]),
    uploadSingleImage("thumbnail"),
    createReview
  );

router.put("/review/:id", authorization(["admin"]), updateReview);
router.delete("/review/:id", authorization(["admin"]), deleteReview);

module.exports = router;