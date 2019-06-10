import React from 'react';
import { Box, Heading, LayoutSet } from 'fannypack';

import MovieListButton from './MovieListButton';
import { moviesResource, movieResource, movieReviewsResource } from './resources';

export default function MovieList(props) {
  const { loadingMovieId, onSelectMovie } = props;

  const movies = moviesResource.unstable_load();

  movies.forEach(movie => {
    movieResource.unstable_preload({ hash: movie.id, params: [movie.id] });
    movieReviewsResource.unstable_preload({ hash: movie.id, params: [movie.id] });
  });

  return (
    <Box>
      <Heading>Jake's Top Movies</Heading>
      <LayoutSet spacing="major-2">
        {movies.map(movie => (
          <MovieListButton
            key={movie.id}
            isLoading={movie.id === loadingMovieId}
            movie={movie}
            onClick={() => onSelectMovie(movie)}
          />
        ))}
      </LayoutSet>
    </Box>
  );
}
