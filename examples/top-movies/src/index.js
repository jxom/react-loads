import React from 'react';
import ReactDOM from 'react-dom';
import { Container, ThemeProvider } from 'fannypack';
import store from 'store';
import * as Loads from 'react-loads';

import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

// Loads.setConfig({
//   cacheProvider: {
//     get: key => store.get(key),
//     set: (key, val) => store.set(key, val)
//   }
// });

function App() {
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);
  }

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-2">
        {currentMovieId ? (
          <MovieDetails movieId={currentMovieId} onClickBack={handleClickBack} />
        ) : (
          <MovieList onSelectMovie={handleSelectMovie} />
        )}
      </Container>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
