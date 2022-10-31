const express = require("express");
const app = express();
const routes = require('./src/routes')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

/* Middlewares */
app.options("*", cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use("/", routes);

/* This is a middleware function that is called when an error occurs. It logs the error to the console
and sends the error message to the client. */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.log(err);
  res.status(status).send(message);
});

module.exports = app;
