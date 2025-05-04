const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    searchTechnologies,
    getAllTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
} = require("../controllers");

const router = express.Router();

router.get("/technology/search?query=", searchTechnologies);

router.get("/technologies", authorization(["admin"]), getAllTechnologies);
router.get("/technology/:id", authorization(["admin"]), getTechnologyById);
router.post("/technology/new", authorization(["admin"]), createTechnology);
router.put("/technology/:id", authorization(["admin"]), updateTechnology);
router.delete("/technology/:id", authorization(["admin"]), deleteTechnology);

module.exports = router;