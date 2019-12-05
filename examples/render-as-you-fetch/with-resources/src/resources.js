import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.createResource({
  context: 'movies',
  load: api.getMovies
});

export const movieResource = Loads.createResource({
  context: 'movie',
  load: api.getMovie
});

export const movieReviewsResource = Loads.createResource({
  context: 'movieReviews',
  load: api.getReviewsByMovieId
});
