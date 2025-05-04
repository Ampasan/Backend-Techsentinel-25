const express = require("express");
const Router = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.urlencoded({ extended: true }));

app.use(Router);

app.listen(3000, () => {
  console.log(`Server berjalan di http://localhost:3000/`);
});