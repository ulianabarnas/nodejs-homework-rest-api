const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const { routerContacts } = require("./routes/api/contacts");
const { routerAuth } = require("./routes/users/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// middlewares
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// routes
app.use("/api/contacts", routerContacts);
app.use("/users", routerAuth);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// error handling
app.use((err, req, res, next) => {
  console.error("Handling errors: ", err.message, err.name);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.kind === "ObjectId") {
    return res.status(404).json({
      message: "Not found",
    });
  }

  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

module.exports = {
  app,
};
