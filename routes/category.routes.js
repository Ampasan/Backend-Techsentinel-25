const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    getAllCategories,
    getCategoryById,
    getAllCategoriesWithTechnologies,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers");

const { uploadSingleImage } = require("../middleware/uploadImage");

const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

router.get("/categories/technologies", authorization(["admin"]), getAllCategoriesWithTechnologies);
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