import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Spinner, ThemeProvider } from 'fannypack';

import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

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
        <React.Suspense fallback={<Spinner />}>
          {showDetails ? (
            <MovieDetails movieId={currentMovieId} onClickBack={handleClickBack} />
          ) : (
            <MovieList onSelectMovie={handleSelectMovie} />
          )}
        </React.Suspense>
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
