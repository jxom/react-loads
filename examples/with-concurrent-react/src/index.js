import React from 'react';
import ReactDOM from 'react-dom';
import * as Loads from 'react-loads';
import { Container, ThemeProvider } from 'fannypack';
import { unstable_scheduleCallback, unstable_IdlePriority } from 'scheduler';

import MovieDetails from './MovieDetails';
import MovieList from './MovieList';

function App() {
  const [showDetails, setShowDetails] = React.useState(false);
  const [currentMovieId, setCurrentMovieId] = React.useState();

  function handleClickBack() {
    setCurrentMovieId();
    setShowDetails(false);
  }

  function handleSelectMovie(movie) {
    setCurrentMovieId(movie.id);

    unstable_scheduleCallback(unstable_IdlePriority, () => {
      setShowDetails(true);
    });
  }

  return (
    <Loads.Provider>
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
    </Loads.Provider>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.unstable_createRoot(rootElement);
root.render(<App />);
