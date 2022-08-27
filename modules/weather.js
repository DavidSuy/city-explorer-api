"use strict";

let axios = require("axios");
let cache = require("./cache.js");

function getWeather(lat, lon) {
  const key = "weather-" + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
  const recent = 1000 * 60 * 24 * 5;

  if (cache[key] && Date.now() - cache[key].timestamp < recent) {
    console.log("Weather Cache hit");
  } else {
    console.log("Weather Cache miss");
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios
      .get(url)
      .then((response) => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map((day) => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
    this.low = day.low_temp;
    this.high = day.max_temp;
  }
}

module.exports = getWeather;
