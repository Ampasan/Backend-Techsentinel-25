const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    addToFavorites,
    getFavorites,
    removeFromFavorites,
} = require("../controllers");

const router = express.Router();

router.post("/favorite/:id_tech", addToFavorites);
router.get("/favorites", getFavorites);
router.delete("/favorite/:id_tech", removeFromFavorites);

module.exports = router;