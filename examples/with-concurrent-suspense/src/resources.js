import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.createResource({
  _key: 'movies',
  load: api.getMovies
});

export const movieResource = Loads.createResource({
  _key: 'movie',
  load: api.getMovie
});

export const movieReviewsResource = Loads.createResource({
  _key: 'movieReviews',
  load: api.getReviewsByMovieId
});
