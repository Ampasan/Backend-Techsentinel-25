const express = require("express");
const authorization = require("../middleware/auth.middleware");
const { uploadSingleImage } = require('../middleware/uploadImage');

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers");

const router = express.Router();

// Public routes
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

// Admin only routes
router.post(
    "/category/new", 
    authorization(["admin"]), 
    uploadSingleImage("icon_category"), 
    createCategory
);
router.patch(
    "/category/:id", 
    authorization(["admin"]), 
    uploadSingleImage("icon_category"), 
    updateCategory
);
router.delete("/category/:id", authorization(["admin"]), deleteCategory);

module.exports = router;