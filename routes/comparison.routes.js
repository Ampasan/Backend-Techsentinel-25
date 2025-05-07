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

const { uploadSingleImage } = require('../middleware/uploadImage');

const router = express.Router();

router.get("/comparison", compareTechnologies);

router.get("/comparisons", authorization(["admin"]), getAllComparisons);
router.get("/comparison/:id", authorization(["admin"]), getComparisonById);
router.post(
    "/comparison/new",
    authorization(["admin"]),
    uploadSingleImage("image_comparison"),
    createComparison
  );
  router.patch(
    "/comparison/:id",
    authorization(["admin"]),
    uploadSingleImage("image_comparison"),
    updateComparison
);
router.delete("/comparion/:id", authorization(["admin"]), deleteComparison);

module.exports = router;