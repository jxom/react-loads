import React from 'react';
import { Box, Heading, LayoutSet, Spinner } from 'fannypack';

import MovieListButton from './MovieListButton';
import { moviesResource } from './resources';

export default function MovieList(props) {
  const { onSelectMovie } = props;

  const getMoviesLoader = moviesResource.useLoads({ suspense: true });
  const movies = getMoviesLoader.response || [];

  return (
    <Box>
      <Heading>Jake's Top Movies</Heading>
      {getMoviesLoader.isPending && <Spinner />}
      {getMoviesLoader.isResolved && (
        <LayoutSet spacing="major-2">
          {movies.map(movie => (
            <MovieListButton key={movie.id} movie={movie} onClick={() => onSelectMovie(movie)} />
          ))}
        </LayoutSet>
      )}
    </Box>
  );
}
