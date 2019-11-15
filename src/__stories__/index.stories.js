import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Group, Image, Input, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { useGetStates, useLoads, useDeferredLoads } from '../index';
import * as api from './api';

storiesOf('useLoads', module)
  .add('basic', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('basic', getRandomDog);

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('basic (deferred)', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useDeferredLoads('basic', getRandomDog);

      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with function variables', () => {
    function Component() {
      const [breed, setBreed] = React.useState('beagle');

      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogRecord = useLoads('functionVariables', getRandomDogByBreed, {
        variables: [breed]
      });

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
              <Box>
                <Button onClick={() => setBreed('doberman')}>Set to doberman</Button>
              </Box>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with function variables (deferred)', () => {
    function Component() {
      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogRecord = useDeferredLoads('functionVariables', getRandomDogByBreed);

      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={() => randomDogRecord.load('beagle')}>Load beagle</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={() => randomDogRecord.load('beagle')} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('suspense', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('suspense', getRandomDog, { suspense: true });
      return (
        <Box>
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return (
      <React.Suspense fallback={<Spinner />}>
        <Component />
      </React.Suspense>
    );
  })
  .add('custom delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useDeferredLoads(getRandomDog, {
        delay: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('no delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useDeferredLoads(getRandomDog, {
        delay: 0
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with error', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const randomDogRecord = useDeferredLoads(getRandomDog, {
        delay: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with timeout', () => {
    function Component() {
      const fn = React.useCallback(() => new Promise(res => setTimeout(() => res('this is data'), 2000)), []);
      const randomDogRecord = useDeferredLoads(fn, {
        timeout: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {(randomDogRecord.isPending || randomDogRecord.isPendingSlow) && <Spinner size="large" />}
          {randomDogRecord.isPendingSlow && 'taking a while'}
          {randomDogRecord.isResolved && <Box>{randomDogRecord.response}</Box>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dependant useLoads', () => {
    function Component({ movieId }) {
      const getMovie = React.useCallback(async movieId => {
        const movie = await api.getMovie(movieId);
        return movie;
      }, []);
      const movieLoader = useLoads('movie', getMovie, { variables: [movieId] });
      const movie = movieLoader.response;

      const getReviews = React.useCallback(async movieId => {
        const reviews = await api.getReviewsByMovieId(movieId);
        return reviews;
      }, []);
      // TODO: Recommendation to use variables over explicit injection?
      const reviewsLoader = useLoads('reviews', getReviews, { variables: () => [movie.id] });
      const reviews = reviewsLoader.response;

      return (
        <Box>
          {movieLoader.isPending && <Spinner />}
          {movieLoader.isResolved && (
            <Box>
              <Box>Title: {movie.title}</Box>
              {reviewsLoader.isResolved && reviews.map(review => review.comment)}
            </Box>
          )}
        </Box>
      );
    }
    return <Component movieId={1} />;
  })
  .add('with dependant useLoads (deferred)', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('dependant', getRandomDog, { defer: true });

      const saveDog = React.useCallback(async imageSrc => new Promise(res => res(`Saved. Image: ${imageSrc}`)), []);
      const saveDogLoader = useDeferredLoads(saveDog, {
        variables: () => [randomDogRecord.response.data.message]
      });

      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                {randomDogRecord.response && (
                  <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
                )}
              </Box>
              <Set>
                <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                  Load another
                </Button>
                {saveDogLoader.isIdle && (
                  <Button isPending={saveDogLoader.isPending} onClick={saveDogLoader.load}>
                    Save dog
                  </Button>
                )}
              </Set>
              {saveDogLoader.isResolved && <Box>{saveDogLoader.response}</Box>}
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with inputs', () => {
    function Component() {
      const [breed, setBreed] = useState('dingo');

      const getRandomDogByBreed = React.useCallback(
        () => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        [breed]
      );
      const randomDogRecord = useLoads('inputs', getRandomDogByBreed);

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Set>
                <Button
                  onClick={() => setBreed('beagle')}
                  isLoading={breed === 'beagle' && randomDogRecord.isReloading}
                >
                  Set to beagle
                </Button>
                <Button onClick={() => setBreed('dingo')} isLoading={breed === 'dingo' && randomDogRecord.isReloading}>
                  Set to dingo
                </Button>
              </Set>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with update fn', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDoberman = React.useCallback(
        () => axios.get('https://dog.ceo/api/breed/doberman/images/random'),
        []
      );
      const randomDogRecord = useLoads('updateFn', getRandomDog, {
        update: getRandomDoberman
      });
      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load}>Load another random dog</Button>
              <Button onClick={randomDogRecord.update}>Load doberman</Button>
            </Box>
          )}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with update fns', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDoberman = React.useCallback(
        () => axios.get('https://dog.ceo/api/breed/doberman/images/random'),
        []
      );
      const getRandomPoodle = React.useCallback(() => axios.get('https://dog.ceo/api/breed/poodle/images/random'), []);

      const randomDogRecord = useLoads('updateFns', getRandomDog, {
        update: [getRandomDoberman, getRandomPoodle]
      });
      const [loadDoberman, loadPoodle] = randomDogRecord.update;

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load}>Load another random dog</Button>
              <Button onClick={loadDoberman}>Load doberman</Button>
              <Button onClick={loadPoodle}>Load poodle</Button>
            </Box>
          )}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with optimistic updates', () => {
    function Component({ movieId }) {
      const [ratingValue, setRatingValue] = React.useState();

      const getMovie = React.useCallback(() => api.getMovie(movieId), [movieId]);
      const movieRecord = useLoads('movie', getMovie);
      const movie = movieRecord.response || {};

      const updateMovie = React.useCallback(
        () => meta => {
          meta.setResponse(movie => ({ ...movie, imdbRating: ratingValue }), 'movie');
          return api.updateMovie(movieId, { imdbRating: ratingValue });
        },
        [movieId, ratingValue]
      );
      const updateMovieRecord = useDeferredLoads('movie', updateMovie);

      return (
        <Box>
          {movieRecord.isPending && <Spinner size="large" />}
          {movieRecord.isResolved && (
            <Box>
              <Box fontSize="400" fontWeight="semibold">
                {movie.title}
              </Box>
              <Box>Rating: {movie.imdbRating}</Box>
              <Group>
                <Input
                  onChange={e => setRatingValue(e.target.value)}
                  placeholder="Enter new rating"
                  value={ratingValue}
                />
                <Button onClick={updateMovieRecord.load} isLoading={updateMovieRecord.isPending}>
                  Update
                </Button>
              </Group>
            </Box>
          )}
          {movieRecord.isRejected && <Alert type="danger">{movieRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component movieId={4} />;
  })
  .add('onResolve hook', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('basic', getRandomDog, { onResolve: record => console.log('success', record) });

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('onReject hook', () => {
    function Component() {
      const getSomething = React.useCallback(async () => {
        return new Promise((res, rej) => setTimeout(() => rej(new Error('This is an error.')), 1000));
      }, []);
      const somethingLoader = useLoads('basic', getSomething, { onReject: error => console.log('error', error) });

      return (
        <Box>
          {somethingLoader.isPending && <Spinner size="large" />}
          {somethingLoader.isRejected && <Alert type="danger">{somethingLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  });

storiesOf('useGetStates', module).add('basic', () => {
  function Component() {
    const getSomething = React.useCallback(async () => {
      return new Promise(res => setTimeout(() => res('This is something.'), 1000));
    }, []);
    const somethingLoader = useLoads('something', getSomething);

    const getAnother = React.useCallback(async () => {
      return new Promise(res => setTimeout(() => res('This is another.'), 5000));
    }, []);
    const anotherLoader = useLoads('another', getAnother, { timeout: 3000 });

    const states = useGetStates(somethingLoader, anotherLoader);

    return (
      <Box>
        {states.isPending && 'Pending...'}
        {states.isPendingSlow && ' Taking a while...'}
        {states.isResolved && `Both records have resolved. ${somethingLoader.response} ${anotherLoader.response}`}
      </Box>
    );
  }
  return <Component />;
});
