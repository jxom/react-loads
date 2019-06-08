import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.unstable_createResource({
  _key: 'movies',
  load: [api.getMovies]
});

export const movieResource = Loads.unstable_createResource({
  _key: 'movie',
  load: [api.getMovie]
});

export const movieReviewsResource = Loads.unstable_createResource({
  _key: 'movieReviews',
  load: [api.getReviewsByMovieId]
});
