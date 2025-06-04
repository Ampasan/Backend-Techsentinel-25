const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
  getAllSpecs,
  getSpecById,
  createSpec,
  updateSpec,
  deleteSpec
} = require("../controllers/spec.controllers");

const router = express.Router();

// Public routes
router.get("/specs", getAllSpecs);
router.get("/spec/:id", getSpecById);

// Admin routes
router.post("/spec/new", authorization(["admin"]), createSpec);
router.patch("/spec/:id", authorization(["admin"]), updateSpec);
router.delete("/spec/:id", authorization(["admin"]), deleteSpec);

module.exports = router;
