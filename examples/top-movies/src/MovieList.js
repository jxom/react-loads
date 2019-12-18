import React from 'react';
import { Box, Heading, LayoutSet, Spinner } from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import MovieListButton from './MovieListButton';

export default function MovieList(props) {
  const { onSelectMovie } = props;

  const getMoviesRecord = Loads.useLoads('movies', api.getMovies);
  const movies = getMoviesRecord.response || [];

  return (
    <Box>
      <Heading>Jake's Top Movies</Heading>
      {getMoviesRecord.isPending && <Spinner />}
      {getMoviesRecord.isResolved && (
        <LayoutSet spacing="major-2">
          {movies.map(movie => (
            <MovieListButton key={movie.id} movie={movie} onClick={() => onSelectMovie(movie)} />
          ))}
        </LayoutSet>
      )}
    </Box>
  );
}
