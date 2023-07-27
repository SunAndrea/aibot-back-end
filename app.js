require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./src/routes/auth");
const { errorFilter } = require("./src/middlewares");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});



app.use(errorFilter);

module.exports = app;
