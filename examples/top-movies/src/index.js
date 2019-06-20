import React from 'react';
import ReactDOM from 'react-dom';
import * as Loads from 'react-loads';
import { Container, ThemeProvider } from 'fannypack';

import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

function App() {
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);
  }

  return (
    <Loads.Provider>
      <ThemeProvider>
        <Container breakpoint="mobile" padding="major-2">
          {currentMovieId ? (
            <MovieDetails movieId={currentMovieId} onClickBack={handleClickBack} />
          ) : (
            <MovieList onSelectMovie={handleSelectMovie} />
          )}
        </Container>
      </ThemeProvider>
    </Loads.Provider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
