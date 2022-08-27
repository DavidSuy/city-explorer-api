const axios = require("axios");

let cache = {};

let getWeather = async (req, res) => {
  // let cacheExpire = 1000 * 60 * 60 * 24 * 30;
  let cacheExpire = 1000 * 20;
  let cacheKey = `${req.query.searchQuery}Cache`;
  console.log(cacheKey);

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timeStamp < cacheExpire) {
    console.log("Gucci, got that cached");
    res.status(200).send(cache[cacheKey].data);
  } else {
    console.log("No Gucci, no cache or  cache expired");

    let weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&lat=${req.query.lat}&lon=${req.query.lon}&days=5`;

    let result = await axios.get(weatherUrl);

    let weatherArr = result.data.data.map((weather) => {
      return new Forcast(weather);
    });

    cache[cacheKey] = {
      data: weatherArr,
      timeStamp: Date.now(),
    };

    console.log(cache);

    res.status(200).send(weatherArr);
  }
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
