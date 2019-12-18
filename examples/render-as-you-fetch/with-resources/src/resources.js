import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.createResource({
  context: 'movies',
  fn: api.getMovies
});

export const movieResource = Loads.createResource({
  context: 'movie',
  fn: api.getMovie
});

export const movieReviewsResource = Loads.createResource({
  context: 'movieReviews',
  fn: api.getReviewsByMovieId
});
