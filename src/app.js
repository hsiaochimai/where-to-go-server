require("dotenv").config();
const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { router: loginRouter, localStrategy, jwtStrategy } = require("./auth");
const tripsRouter = require("./trips/trips-router");
const app = express();

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use("/api/auth", loginRouter);
app.use("/api/trips", tripsRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
module.exports = app;
