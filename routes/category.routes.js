const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    getAllCategories,
    getCategoryById,
    getAllCategoriesWithTechnologies,
    getCategoryByIdWithTechnologies,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers");

const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

router.get("/categories/technologies", authorization(["admin"]), getAllCategoriesWithTechnologies);
router.get("/category/:id/technologies", authorization(["admin"]), getCategoryByIdWithTechnologies);
router.post(
    "/category/new",
    authorization(["admin"]),
    createCategory
  );
router.put("/category/:id", authorization(["admin"]), updateCategory);
router.delete("/category/:id", authorization(["admin"]), deleteCategory);

module.exports = router;