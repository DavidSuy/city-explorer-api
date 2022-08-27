"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weather = require("./modules/weather.js");
const movie = require("./modules/movie.js");

// Middleware
const app = express();
app.use(cors());

// Route
app.get("/", (req, res) => res.send("we in it"));
app.get("/weather", weatherHandler);
app.get("/movie", movieHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send("Sorry. Something went wrong!");
    });
}

function movieHandler(req, res) {
  const searchQuery = req.query.searchQuery;
  movie(searchQuery)
    .then((movies) => res.send(movies))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Sorry, can't find movie. Please check city name");
    });
}

app.listen(process.env.PORT, () =>
  console.log(`Server up on ${process.env.PORT}`)
);
