"use strict";

const express = require("express");
const cors = require("cors");
// let data = require("./data/weather.json");
require("dotenv").config();
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());

// API Requests
let getWeather = async (req, res) => {
  let weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&lat=${req.query.lat}&lon=${req.query.lon}`;

  let result = await axios.get(weatherUrl);

  let weatherArr = result.data.data.map((weather) => {
    return new Forcast(weather);
  });

  res.status(200).send(weatherArr);
};

let getMovie = async (req, res) => {
  let searchQuery = req.query.searchQuery;

  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
  let result = await axios.get(movieUrl);
  let movieArr = result.data.results.map((movie) => {
    return new Movie(movie);
  });

  res.send(movieArr);
};

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
class Forcast {
  constructor(weather) {
    this.description = weather.weather.description;
    this.low = weather.low_temp;
    this.high = weather.high_temp;
    this.date = weather.valid_date;
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.poster_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
