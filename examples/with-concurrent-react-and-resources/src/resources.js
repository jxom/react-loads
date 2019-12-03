import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.createResource({
  key: 'movies',
  load: api.getMovies
});

export const movieResource = Loads.createResource({
  key: 'movie',
  load: api.getMovie
});

export const movieReviewsResource = Loads.createResource({
  key: 'movieReviews',
  load: api.getReviewsByMovieId
});
