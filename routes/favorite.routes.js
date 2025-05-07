const express = require("express");
const authorization = require("../middleware/auth.middleware");

const {
    addToFavorites,
    getFavorites,
    removeFromFavorites,
} = require("../controllers");

const router = express.Router();

router.post("/favorite/:id_tech", authorization(["user", "admin"]), addToFavorites);
router.get("/favorites", authorization(["user", "admin"]), getFavorites);
router.delete("/favorite/:id_tech", authorization(["user", "admin"]), removeFromFavorites);

module.exports = router;