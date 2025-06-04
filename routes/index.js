const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const technologyRoutes = require("./technology.routes");
const favoriteRoutes = require("./favorite.routes");
const comparisonRoutes = require("./comparison.routes");
const authRoutes = require("./auth.routes");
const articleRoutes = require("./article.routes");
const specRoutes = require("./spec.routes");
const reviewRoutes = require("./review.routes");

const express = require("express");

const Router = express.Router();

Router.use(userRoutes);
Router.use(categoryRoutes);
Router.use(technologyRoutes);
Router.use(favoriteRoutes);
Router.use(comparisonRoutes);
Router.use(articleRoutes);
Router.use(specRoutes);
Router.use(reviewRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;