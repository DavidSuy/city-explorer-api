"use strict";

const express = require("express");
const cors = require("cors");
let data = require("./data/weather.json");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());

// Handlers
let handleWeatherRoute = (req, res, next) => {
  try {
    let result = data.find((weather) => {
      return (
        parseInt(weather.lat) === parseInt(req.query.lat) &&
        parseInt(weather.lon) === parseInt(req.query.lon)
      );
    });

    if (!result) {
      throw `Couldn't find weather for that city. Please check spelling.`;
    }

    let weatherArr = result.data.map((weather) => {
      return new Forcast({
        description: `Low of ${weather.low_temp}, High of ${weather.high_temp}`,
        date: weather.valid_date,
      });
    });

    // console.log(weatherArr);
    res.send(weatherArr);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Errors
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

// Routes
app.get("/", (req, res) => res.send("hi from the server"));
app.get("/weather", handleWeatherRoute);
app.get("*", (req, res) => {
  res.status(404).send("Route doesn't exist");
});

// Classes
class Forcast {
  constructor(weather) {
    this.description = weather.description;
    this.date = weather.date;
  }
}

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
