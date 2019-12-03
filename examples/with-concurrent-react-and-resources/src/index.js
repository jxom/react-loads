import React from 'react';
import ReactDOM from 'react-dom';
import * as Loads from 'react-loads';
import { Container, ThemeProvider } from 'fannypack';

import MovieDetails from './MovieDetails';
import MovieList from './MovieList';
import { movieResource } from './resources';

function App() {
  const [startTransition] = React.useTransition({ timeoutMs: 1000 });
  // const [resource, setResource] = React.useState();
  const [showDetails, setShowDetails] = React.useState(false);
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
    setShowDetails(false);
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);

    startTransition(() => {
      // setResource(movieResource(movie.id));
      setShowDetails(true);
    });
  }

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-2">
        <React.Suspense fallback={<div>loading...</div>}>
          {showDetails ? (
            <MovieDetails movieId={currentMovieId} onClickBack={handleClickBack} />
          ) : (
            <MovieList loadingMovieId={currentMovieId} onSelectMovie={handleSelectMovie} />
          )}
        </React.Suspense>
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
