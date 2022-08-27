const axios = require("axios");
const cache = require("./cache");

let getMovie = async (searchQuery) => {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
  const key = "movie-" + searchQuery;
  const recent = 1000 * 60 * 24 * 5;

  if (cache[key] && Date.now() - cache[key].timestamp < recent) {
    console.log("Movie Cache hit");
  } else {
    console.log("Movie Cache miss");
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios
      .get(url)
      .then((movieData) => parseMovie(movieData.data.results));
  }

  return cache[key].data;
};

function parseMovie(weatherData) {
  try {
    const movieArr = weatherData.map((movie) => {
      return new Movie(movie);
    });

    return Promise.resolve(movieArr);
  } catch (e) {
    return Promise.reject(e);
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

module.exports = getMovie;
