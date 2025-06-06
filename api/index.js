const express = require("express");
const Router = require("../routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [process.env.FRONTEND_ORIGIN];

const app = express();

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.urlencoded({ extended: true }));

app.use(Router);

app.listen(5000, () => {
  console.log(`Server berjalan di http://localhost:5000/`);
});