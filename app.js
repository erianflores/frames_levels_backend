const authRoutes = require("./routes/user.routes");
const mongoose = require("mongoose");
const cors = require("cors");


// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
const gamesRoutes = require("./routes/games.routes");
const reviewRoutes = require("./routes/reviews.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/games", gamesRoutes);
app.use("/api/index", indexRoutes);
console.log("userRoutes loaded!")
app.use("/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
