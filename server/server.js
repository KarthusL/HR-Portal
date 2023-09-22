const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

const routes = require("./routes/index");
const verifyTokenMiddleware = require("./middleware/verifyTokenMiddleware");
const verifyRoleMiddleware = require("./middleware/verifyRoleMiddleware");
const verifyURLMiddleware = require("./middleware/verifyURLMiddleware");

app.set("view engine", "pug");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//auth API
app.use("/api/auth", routes.AuthRouter);

//hr API
app.use(
  "/api/hr",
  verifyTokenMiddleware,
  verifyRoleMiddleware.verifyHRMiddleware,
  routes.HRRouter
);

//employee API and shared API
app.use("/api/info", routes.personalInfoRouter);
app.use("/api/housing", routes.housingRouter);

//backend router protection
app.use("/api", (_req, res) =>
  res.status(404).json({ message: "Invalid URL or Method!" })
);
app.use("*", verifyURLMiddleware);

module.exports = app;
