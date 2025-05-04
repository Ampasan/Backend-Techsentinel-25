const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const technologyRoutes = require("./technology.routes");
const reviewRoutes = require("./review.routes");
const favoriteRoutes = require("./favorite.routes");
const comparisonRoutes = require("./comparison.routes");
const authRoutes = require("./auth.routes");

const express = require("express");

const Router = express.Router();

Router.use(userRoutes);
Router.use(categoryRoutes);
Router.use(technologyRoutes);
Router.use(reviewRoutes);
Router.use(favoriteRoutes);
Router.use(comparisonRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;