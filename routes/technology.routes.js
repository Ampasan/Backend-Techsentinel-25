const express = require("express");
const authorization = require("../middleware/auth.middleware");
const { uploadSingleImage } = require('../middleware/uploadImage');

const {
    searchTechnologies,
    getAllTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
} = require("../controllers");

const router = express.Router();

// Public routes - no auth needed
router.get("/technology/search", searchTechnologies);
router.get("/technologies", getAllTechnologies);
router.get("/technology/:id", getTechnologyById);

// Admin routes
router.post(
    "/technology/new",
    authorization(["admin"]),
    uploadSingleImage("tech_image"),
    createTechnology
);
router.patch(
    "/technology/:id",
    authorization(["admin"]),
    uploadSingleImage("tech_image"),
    updateTechnology
);
router.delete("/technology/:id", authorization(["admin"]), deleteTechnology);

module.exports = router;