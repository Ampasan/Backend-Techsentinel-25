const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    compareTechnologies,
    getAllComparisons,
    getComparisonById,
    createComparison,
    updateComparison,
    deleteComparison,
} = require("../controllers");

const router = express.Router();

// Public routes - no auth needed
router.get("/comparison", compareTechnologies);
router.get("/comparisons", getAllComparisons);
router.get("/comparison/:id", getComparisonById);

// Admin routes
router.post("/comparison/new", authorization(["admin"]), createComparison);
router.patch("/comparison/:id", authorization(["admin"]), updateComparison);
router.delete("/comparison/:id", authorization(["admin"]), deleteComparison);

module.exports = router;