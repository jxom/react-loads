import React from 'react';
import { Box, Heading, LayoutSet, Spinner } from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import MovieListButton from './MovieListButton';
import { moviesResource, movieResource, movieReviewsResource } from './resources';

// export default function MovieList(props) {
//   const { loadingMovieId, onSelectMovie } = props;

//   const getMoviesLoader = moviesResource.useLoads();
//   const movies = getMoviesLoader.response || [];

//   return (
//     <Box>
//       <Heading>Jake's Top Movies</Heading>
//       {getMoviesLoader.isPending && <Spinner />}
//       {getMoviesLoader.isResolved && (
//         <LayoutSet spacing="major-2">
//           {movies.map(movie => (
//             <MovieListButton key={movie.id} movie={movie} onClick={() => onSelectMovie(movie)} />
//           ))}
//         </LayoutSet>
//       )}
//     </Box>
//   );
// }

export default function MovieList(props) {
  const { loadingMovieId, onSelectMovie } = props;

  const movies = moviesResource.unstable_load();

  // movies.forEach(movie => {
  //   movieResource.unstable_preload(movie.id);
  //   movieReviewsResource.unstable_preload(movie.id);
  // });

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
