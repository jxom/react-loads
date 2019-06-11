import React from 'react';
import { Box, Heading, LayoutSet, Spinner } from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import MovieListButton from './MovieListButton';

export default function MovieList(props) {
  const { onSelectMovie } = props;

  const getMovies = React.useCallback(async () => {
    const movies = api.getMovies();
    return movies;
  }, []);
  const getMoviesLoader = Loads.useLoads(getMovies, { context: 'movies' });
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
