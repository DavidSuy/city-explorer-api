const axios = require("axios");

let getWeather = async (req, res) => {
  let weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&lat=${req.query.lat}&lon=${req.query.lon}`;

  let result = await axios.get(weatherUrl);

  let weatherArr = result.data.data.map((weather) => {
    return new Forcast(weather);
  });

  res.status(200).send(weatherArr);
};

class Forcast {
  constructor(weather) {
    this.description = weather.weather.description;
    this.low = weather.low_temp;
    this.high = weather.high_temp;
    this.date = weather.valid_date;
  }
}

module.exports = getWeather;
