import React from 'react';
import { Box, Heading, LayoutSet } from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import MovieListButton from './MovieListButton';

export default function MovieList(props) {
  const { loadingMovieId, onSelectMovie } = props;

  const moviesLoader = Loads.useLoads('movies', api.getMovies);
  const movies = moviesLoader.response || [];

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
