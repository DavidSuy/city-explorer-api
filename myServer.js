"use strict";

const express = require("express");
const cors = require("cors");
// let data = require("./data/weather.json");
require("dotenv").config();
const getWeather = require("./weather");
const getMovie = require("./movie");

const app = express();

// Middleware
app.use(cors());

// API Requests

// Errors
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

// Routes
app.get("/", (req, res) => res.send("hi from the server"));
app.get("/weather", getWeather);
app.get("/movie", getMovie);

app.get("*", (req, res) => {
  res.status(404).send("Route doesn't exist");
});

// Classes

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
