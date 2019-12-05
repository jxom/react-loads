import React from 'react';
import ReactDOM from 'react-dom';
import { Container, ThemeProvider } from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

Loads.setConfig({
  suspense: true
});

function getMovieLoaders(movieId) {
  return {
    movie: Loads.preload('movie', api.getMovie, { variables: [movieId] }),
    reviews: Loads.preload('movieReviews', api.getReviewsByMovieId, { variables: [movieId] })
  };
}

function App() {
  const [startTransition] = React.useTransition({ timeoutMs: 1000 });
  const [movieResource, setMovieResource] = React.useState();
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
    setMovieResource();
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);

    startTransition(() => {
      const movieResource = getMovieLoaders(movie.id);
      setMovieResource(movieResource);
    });
  }

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-2">
        <React.Suspense fallback={<div>loading...</div>}>
          {movieResource ? (
            <MovieDetails movieResource={movieResource} onClickBack={handleClickBack} />
          ) : (
            <MovieList loadingMovieId={currentMovieId} onSelectMovie={handleSelectMovie} />
          )}
        </React.Suspense>
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
