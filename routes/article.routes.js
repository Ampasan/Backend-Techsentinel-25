const express = require("express");
const authorization = require("../middleware/auth.middleware");
const {
  searchArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article.controllers");
const { uploadMultipleImages } = require("../middleware/uploadImage");

const router = express.Router();

// Public routes
router.get("/articles/search", searchArticles);
router.get("/articles", getAllArticles);
router.get("/article/:id", getArticleById);

// Admin routes
router.post(
  "/article/new",
  authorization(["admin"]),
  uploadMultipleImages([
    { name: "article_image", maxCount: 1 },
    { name: "subImage", maxCount: 1 },
    { name: "section2Image", maxCount: 1 }
  ]),
  createArticle
);

router.patch(
  "/article/:id",
  authorization(["admin"]),
  uploadMultipleImages([
    { name: "article_image", maxCount: 1 },
    { name: "subImage", maxCount: 1 },
    { name: "section2Image", maxCount: 1 }
  ]),
  updateArticle
);

router.delete("/article/:id", authorization(["admin"]), deleteArticle);

module.exports = router;