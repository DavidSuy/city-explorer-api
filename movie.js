const axios = require("axios");

let getMovie = async (req, res) => {
  let searchQuery = req.query.searchQuery;

  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
  let result = await axios.get(movieUrl);
  let movieArr = result.data.results.map((movie) => {
    return new Movie(movie);
  });

  res.send(movieArr);
};

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
