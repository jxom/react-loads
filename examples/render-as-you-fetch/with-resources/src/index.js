import React from 'react';
import ReactDOM from 'react-dom';
import { Container, ThemeProvider } from 'fannypack';
import * as Loads from 'react-loads';

import { movieResource, movieReviewsResource } from './resources';
import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

const loadsConfig = {
  suspense: true
};

function getMovieLoaders(movieId) {
  return {
    movie: movieResource.preload({ variables: [movieId] }),
    reviews: movieReviewsResource.preload({ variables: [movieId] })
  };
}

function App() {
  const [startTransition] = React.useTransition({ timeoutMs: 1000 });
  const [movieLoaders, setMovieLoaders] = React.useState();
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
    setMovieLoaders();
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);

    startTransition(() => {
      const movieLoaders = getMovieLoaders(movie.id);
      setMovieLoaders(movieLoaders);
    });
  }

  return (
    <Loads.Provider config={loadsConfig}>
      <ThemeProvider>
        <Container breakpoint="mobile" padding="major-2">
          <React.Suspense fallback={<div>loading...</div>}>
            {movieLoaders ? (
              <MovieDetails movieLoaders={movieLoaders} onClickBack={handleClickBack} />
            ) : (
              <MovieList loadingMovieId={currentMovieId} onSelectMovie={handleSelectMovie} />
            )}
          </React.Suspense>
        </Container>
      </ThemeProvider>
    </Loads.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
